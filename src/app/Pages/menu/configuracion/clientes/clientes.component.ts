import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ClienteService } from '../../../../../services/cliente.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalClientesDialogComponent } from './modal-clientes-dialog/modal-clientes-dialog.component';
import { ModalNumbersDialogComponent } from './modal-numbers-dialog/modal-numbers-dialog.component';
import { ModalHijosDialogComponent } from './modal-hijos-dialog/modal-hijos-dialog.component';
import { SidebarService } from '../../../../../services/sidebar.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.scss'
})
export class ClientesComponent {

  clientes: any[] = [];

  filtroTexto: string = '';
  filtroEstado: string = '';
  filtroGenero: string = '';

  paginaActual = 1;
  filasPorPagina = 50;

  roleCode: string | null = null;


  constructor(private dialog: MatDialog, private clienteService: ClienteService,
    private snackBar: MatSnackBar, private sidebarService: SidebarService) {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    this.roleCode = user?.roleCode;
  }

  ngOnInit() {
    this.loadClientes();
  }

  loadClientes() {
    this.clienteService.getClientesByEstablishment().subscribe(data => {
      this.clientes = data;
    });
  }

  removerFiltros() {
    this.filtroTexto = '';
    this.filtroEstado = '';
    this.filtroGenero = '';
    this.paginaActual = 1;
  }

  paginaAnterior() {
    if (this.paginaActual > 1) this.paginaActual--;
  }

  paginaSiguiente() {
    if (this.paginaActual * this.filasPorPagina < this.clientes.length) this.paginaActual++;
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(ModalClientesDialogComponent, {
      width: '1600px',
      panelClass: 'full-modal'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadClientes();
      }
    });
  }

  openMenu() {
    this.sidebarService.toggleSidenav();
  }

  getPrimaryPhone(contacts: any[]): string {
    if (!contacts || contacts.length === 0) return "";

    const primary = contacts.find(x => x.isPrimary);
    return (primary?.number || contacts[0]?.number || "").toString();
  }

  getInitials(fullName: string): string {
    if (!fullName) return "";

    const words = fullName
      .trim()
      .split(/\s+/)
      .filter(w => w.length > 0);

    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }

    // Si tiene 1 palabra: 2 primeras letras
    return words[0].substring(0, 2).toUpperCase();
  }

  openHijosDialog(cliente: any, modo: 'listar' | 'agregar') {
    const dialogRef = this.dialog.open(ModalHijosDialogComponent, {
      width: '400px',
      data: { cliente, modo }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadClientes();
      }
      if (result.message) {
        this.snackBar.open(result.message, '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
      }
    });
  }

  openNumbersDialog(cliente: any) {
    const dialogRef = this.dialog.open(ModalNumbersDialogComponent, {
      width: '400px',
      data: { cliente }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // si modificó los números, podrías refrescar la lista
        this.loadClientes();
      }
    });
  }
  updateMarketing(cliente: any) {
    console.log(cliente)
    this.clienteService.updateMarketing(cliente.id, cliente.acceptsMarketing).subscribe({
      next: (response) => {
        this.snackBar.open('Preferencia de marketing actualizada', '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
        this.loadClientes();
      },
      error: (error) => {
        this.snackBar.open('Error al actualizar preferencia de marketing', '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  updateEstado(cliente: any) {
    this.clienteService.updateStateEmpleado(cliente.id, cliente.isActive).subscribe({
      next: (response) => {
        this.snackBar.open('Estado actualizado', '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
        this.loadClientes();

      },
      error: (error) => {
        this.snackBar.open('Error al actualizar estado', '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  openEditDialog(item: any) {
    const dialogRef = this.dialog.open(ModalClientesDialogComponent, {
      width: '2000px',
      data: item
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadClientes();
      }
    });
  }


}
