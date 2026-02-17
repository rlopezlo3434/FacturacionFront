import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BudgetService } from '../../../../../../services/budget.service';
import { ProductosService } from '../../../../../../services/productos.service';
import { ServicesServiceService } from '../../../../../../services/services-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-modal-budget-create-dialog',
  templateUrl: './modal-budget-create-dialog.component.html',
  styleUrl: './modal-budget-create-dialog.component.scss'
})
export class ModalBudgetCreateDialogComponent {
  // ✅ Maestros
  products: any[] = [];
  services: any[] = [];

  // ✅ Search
  searchProduct = '';
  searchService = '';

  filteredProducts: any[] = [];
  filteredServices: any[] = [];

  // ✅ Items del presupuesto
  items: any[] = [];

  total = 0;
  notes: string = '';
  constructor(
    public dialogRef: MatDialogRef<ModalBudgetCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private budgetService: BudgetService,
    private productService: ProductosService,
    private servicesMasterService: ServicesServiceService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadMasters();
  }

  loadMasters() {
    // ✅ productos
    this.productService.getProducts().subscribe((res: any) => {
      this.products = res?.data || [];
    });

    // ✅ servicios
    this.servicesMasterService.getServices().subscribe((res: any) => {
      this.services = res?.data || [];
    });
  }

  // ✅ Filtro productos
  filterProducts() {
    const t = (this.searchProduct || '').trim().toLowerCase();
    if (!t) {
      this.filteredProducts = [];
      return;
    }

    this.filteredProducts = this.products
      .filter(x =>
        (x.code || '').toLowerCase().includes(t) ||
        (x.name || '').toLowerCase().includes(t) ||
        (x.serialCode || '').toLowerCase().includes(t)
      )
      .slice(0, 8);
  }

  // ✅ Filtro servicios
  filterServices() {
    const t = (this.searchService || '').trim().toLowerCase();
    if (!t) {
      this.filteredServices = [];
      return;
    }

    this.filteredServices = this.services
      .filter(x =>
        (x.code || '').toLowerCase().includes(t) ||
        (x.name || '').toLowerCase().includes(t)
      )
      .slice(0, 8);
  }

  // ✅ Agregar producto al detalle
  addProduct(p: any) {
    this.items.push({
      itemType: 1,
      productId: p.id,
      serviceMasterId: null,
      serialCode: p.serialCode,
      name: `${p.code} - ${p.name}`,
      quantity: 1,
      unitPrice: Number(p.price || 0),
      discount: 0,
      totalPrice: Number(p.price || 0)
    });

    this.searchProduct = '';
    this.filteredProducts = [];
    this.calcTotals();
  }

  // ✅ Agregar servicio al detalle
  addService(s: any) {
    this.items.push({
      itemType: 2,
      productId: null,
      serviceMasterId: s.id,
      serialCode: null,
      name: `${s.code} - ${s.name}`,
      quantity: 1,
      unitPrice: Number(s.price || 0),
      totalPrice: Number(s.price || 0),
      discount: Number(s.discount || 0),
    });

    this.searchService = '';
    this.filteredServices = [];
    this.calcTotals();
  }

  removeItem(index: number) {
    this.items.splice(index, 1);
    this.calcTotals();
  }

  // ✅ Calcular totales
  calcTotals() {
    this.total = 0;

    for (const it of this.items) {
      const qty = Number(it.quantity || 0);
      const price = Number(it.unitPrice || 0);
      const discount = Number(it.discount || 0);

      const gross = qty * price;

      // 🛑 seguridad: descuento no mayor al total bruto
      const appliedDiscount = discount > gross ? gross : discount;

      it.discount = appliedDiscount;
      it.totalPrice = gross - appliedDiscount;

      this.total += it.totalPrice;
    }
  }

  // ✅ Guardar
  guardar() {
    const payload = {
      vehicleIntakeId: this.data.intakeId,
      notes: this.notes || null,
      items: this.items.map(x => ({
        itemType: x.itemType,
        productId: x.productId,
        serviceMasterId: x.serviceMasterId,
        quantity: Number(x.quantity),
        unitPrice: Number(x.unitPrice),
        discount: x.discount,
      }))
    };

    this.budgetService.createBudget(payload).subscribe({
      next: (resp: any) => {
        this.snackBar.open(resp?.message || 'Presupuesto creado correctamente', '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
        this.notes = '';

        this.dialogRef.close(true);
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Error al crear presupuesto', '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });

        this.notes = '';

      }
    });
  }

  cancelar() {
    this.dialogRef.close(false);
  }
}
