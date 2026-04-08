import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SidebarService } from '../../../../../services/sidebar.service';
import { ClienteService } from '../../../../../services/cliente.service';
import { ProveedorService } from '../../../../../services/proveedor.service';
import { ModalProveedorDialogComponent } from './modal-proveedor-dialog/modal-proveedor-dialog.component';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrl: './proveedores.component.scss',
})
export class ProveedoresComponent {
  proveedores: any[] = [];
  filtroTexto: string = '';

  paginaActual = 1;
  filasPorPagina = 50;

  roleCode: string | null = null;

  constructor(
    private dialog: MatDialog,
    private clienteService: ClienteService,
    private proveedorService: ProveedorService,
    private snackBar: MatSnackBar,
    private sidebarService: SidebarService
  ) {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    this.roleCode = user?.roleCode;
  }

  ngOnInit() {
    this.loadProveedores();
  }

  loadProveedores() {
    this.proveedorService.getProveedores().subscribe(data => {
      this.proveedores = data;
    });
  }

  removerFiltros() {
    this.filtroTexto = '';
    this.paginaActual = 1;
  }

  paginaAnterior() {
    if (this.paginaActual > 1) this.paginaActual--;
  }

  paginaSiguiente() {
    if (this.paginaActual * this.filasPorPagina < this.proveedores.length)
      this.paginaActual++;
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(ModalProveedorDialogComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProveedores();
      }
    });
  }

  openMenu() {
    this.sidebarService.toggleSidenav();
  }

  getInitials(text: string): string {
    if (!text) return "";

    const words = text
      .trim()
      .split(/\s+/)
      .filter(w => w.length > 0);

    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }

    return words[0].substring(0, 2).toUpperCase();
  }

  updateEstadoProveedor(proveedor: any) {

    this.proveedorService.updateProveedor(proveedor.id, proveedor).subscribe({
      next: () => {
        this.snackBar.open('Estado actualizado', '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });

        this.loadProveedores();
      },

      error: () => {
        this.snackBar.open('Error al actualizar estado', '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });

  }


  openEditDialog(proveedor: any) {

    const dialogRef = this.dialog.open(ModalProveedorDialogComponent, {
      width: '600px',
      data: proveedor
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProveedores();
      }
    });

  }
}
