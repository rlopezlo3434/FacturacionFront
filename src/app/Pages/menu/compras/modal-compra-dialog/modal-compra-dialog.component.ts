import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ComprasService } from '../../../../../services/compras.service';

@Component({
  selector: 'app-modal-compra-dialog',
  templateUrl: './modal-compra-dialog.component.html',
  styleUrl: './modal-compra-dialog.component.scss'
})
export class ModalCompraDialogComponent implements OnInit {
  proveedores: any[] = [];
  productos: any[] = [];
  isSaving = false;

  compra = {
    proveedorId: null as number | null,
    fechaDocumento: new Date().toISOString().substring(0, 10),
    moneda: 'SOLES',
    serie: '',
    correlativo: '',
    detalles: [] as { productId: number | null; cantidad: number; precioCompra: number; searchText: string; showOptions: boolean; dropdownStyle: any }[]
  };

  proveedorSearch = '';
  proveedorSeleccionado: any = null;
  showProveedorDropdown = false;
  proveedorDropdownStyle: any = {};

  constructor(
    private dialogRef: MatDialogRef<ModalCompraDialogComponent>,
    private comprasService: ComprasService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.comprasService.getProveedores().subscribe((res: any) => {
      this.proveedores = Array.isArray(res) ? res : (res.data || []);
    });
    this.comprasService.getProductos().subscribe((res: any) => {
      this.productos = res.data || [];
    });
    this.addDetalle();
  }

  addDetalle() {
    this.compra.detalles.push({ productId: null, cantidad: 1, precioCompra: 0, searchText: '', showOptions: false, dropdownStyle: {} });
  }

  removeDetalle(i: number) {
    this.compra.detalles.splice(i, 1);
  }

  getFilteredProductos(i: number) {
    const q = this.compra.detalles[i].searchText.toLowerCase();
    return this.productos.filter(p => p.name.toLowerCase().includes(q) || p.code?.toLowerCase().includes(q));
  }

  selectProducto(i: number, p: any) {
    this.compra.detalles[i].productId = p.id;
    this.compra.detalles[i].searchText = `${p.code ? p.code + ' - ' : ''}${p.name}`;
    this.compra.detalles[i].showOptions = false;
  }

  showOptions(i: number, event: FocusEvent) {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    this.compra.detalles[i].dropdownStyle = {
      top: rect.bottom + 4 + 'px',
      left: rect.left + 'px',
      width: rect.width + 'px'
    };
    this.compra.detalles[i].showOptions = true;
  }
  hideOptions(i: number) { setTimeout(() => { this.compra.detalles[i].showOptions = false; }, 200); }

  showProveedorOptions(event: FocusEvent) {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    this.proveedorDropdownStyle = {
      top: rect.bottom + 4 + 'px',
      left: rect.left + 'px',
      width: rect.width + 'px'
    };
    this.showProveedorDropdown = true;
  }

  get proveedoresFiltrados() {
    const q = this.proveedorSearch.toLowerCase();
    return this.proveedores.filter(p =>
      p.razonSocial.toLowerCase().includes(q) || p.ruc.includes(q)
    );
  }

  selectProveedor(p: any) {
    this.proveedorSeleccionado = p;
    this.compra.proveedorId = p.id;
    this.proveedorSearch = p.razonSocial;
    this.showProveedorDropdown = false;
  }

  limpiarProveedor() {
    this.proveedorSeleccionado = null;
    this.compra.proveedorId = null;
    this.proveedorSearch = '';
  }

  get currencyCode() { return this.compra.moneda === 'DOLARES' ? 'USD' : 'PEN'; }

  get total() {
    return +this.compra.detalles.reduce((a, d) => a + d.cantidad * d.precioCompra, 0).toFixed(2);
  }
  get subtotal() { return +(this.total / 1.18).toFixed(2); }
  get igv() { return +(this.total - this.subtotal).toFixed(2); }

  guardar() {
    if (!this.compra.proveedorId) {
      this.snackBar.open('Selecciona un proveedor', '', { duration: 3000, panelClass: ['error-snackbar'] });
      return;
    }
    const detallesValidos = this.compra.detalles.filter(d => d.productId && d.cantidad > 0);
    if (detallesValidos.length === 0) {
      this.snackBar.open('Agrega al menos un producto', '', { duration: 3000, panelClass: ['error-snackbar'] });
      return;
    }

    const dto = {
      proveedorId: this.compra.proveedorId,
      fechaDocumento: this.compra.fechaDocumento,
      moneda: this.compra.moneda,
      serie: this.compra.serie || null,
      correlativo: this.compra.correlativo || null,
      detalles: detallesValidos.map(d => ({
        productId: d.productId,
        cantidad: d.cantidad,
        precioCompra: d.precioCompra
      }))
    };

    this.isSaving = true;
    this.comprasService.create(dto).subscribe({
      next: () => {
        this.isSaving = false;
        this.snackBar.open('Compra registrada', '', { duration: 3000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['success-snackbar'] });
        this.dialogRef.close(true);
      },
      error: () => {
        this.isSaving = false;
        this.snackBar.open('Error al registrar la compra', '', { duration: 3000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar'] });
      }
    });
  }

  cancelar() { this.dialogRef.close(false); }
}
