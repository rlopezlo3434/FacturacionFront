import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ComprasService } from '../../../../services/compras.service';
import { SidebarService } from '../../../../services/sidebar.service';
import { ModalCompraDialogComponent } from './modal-compra-dialog/modal-compra-dialog.component';
import { ModalDetalleCompraDialogComponent } from './modal-detalle-compra-dialog/modal-detalle-compra-dialog.component';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrl: './compras.component.scss'
})
export class ComprasComponent {
  compras: any[] = [];
  filtroTexto = '';
  paginaActual = 1;
  filasPorPagina = 50;

  constructor(
    private comprasService: ComprasService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private sidebarService: SidebarService
  ) {}

  ngOnInit() {
    this.loadCompras();
  }

  loadCompras() {
    this.comprasService.getAll().subscribe({
      next: (res: any) => { this.compras = res.data || []; },
      error: () => {}
    });
  }

  get comprasFiltradas() {
    const q = this.filtroTexto.toLowerCase();
    return this.compras.filter(c =>
      c.proveedorRazonSocial?.toLowerCase().includes(q) ||
      c.proveedorRuc?.toLowerCase().includes(q)
    );
  }

  get totalGeneral() {
    return this.compras.reduce((a, b) => a + (b.total || 0), 0);
  }

  openCreateDialog() {
    const ref = this.dialog.open(ModalCompraDialogComponent, { maxWidth: '60vw', width: '1500px', });
    ref.afterClosed().subscribe(result => { if (result) this.loadCompras(); });
  }

  verDetalle(id: number) {
    this.dialog.open(ModalDetalleCompraDialogComponent, { maxWidth: '60vw', width: '1500px', data: { id } });
  }

  eliminar(id: number) {
    if (!confirm('¿Eliminar esta compra?')) return;
    this.comprasService.delete(id).subscribe({
      next: () => {
        this.snackBar.open('Compra eliminada', '', { duration: 3000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['success-snackbar'] });
        this.loadCompras();
      },
      error: () => {
        this.snackBar.open('Error al eliminar', '', { duration: 3000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar'] });
      }
    });
  }

  getInitials(text: string): string {
    if (!text) return '';
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    return words.length >= 2
      ? (words[0][0] + words[1][0]).toUpperCase()
      : words[0].substring(0, 2).toUpperCase();
  }

  paginaAnterior() { if (this.paginaActual > 1) this.paginaActual--; }
  paginaSiguiente() { if (this.paginaActual * this.filasPorPagina < this.comprasFiltradas.length) this.paginaActual++; }
  openMenu() { this.sidebarService.toggleSidenav(); }
}
