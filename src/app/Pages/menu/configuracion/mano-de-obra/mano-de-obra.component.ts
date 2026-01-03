import { Component } from '@angular/core';
import { ModalNumbersDialogComponent } from '../clientes/modal-numbers-dialog/modal-numbers-dialog.component';
import { ModalHijosDialogComponent } from '../clientes/modal-hijos-dialog/modal-hijos-dialog.component';
import { ModalClientesDialogComponent } from '../clientes/modal-clientes-dialog/modal-clientes-dialog.component';
import { SidebarService } from '../../../../../services/sidebar.service';
import { MatDialog } from '@angular/material/dialog';
import { ClienteService } from '../../../../../services/cliente.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-mano-de-obra',
  templateUrl: './mano-de-obra.component.html',
  styleUrl: './mano-de-obra.component.scss'
})
export class ManoDeObraComponent {
  manoDeObra = [
    { "id": 1, "codigo": "SRV-001", "servicio": "Cambio de aceite y filtro de aceite", "tipoVehiculo": "Auto", "precio": 150, "activo": true },
    { "id": 2, "codigo": "SRV-001", "servicio": "Cambio de aceite y filtro de aceite", "tipoVehiculo": "Camioneta", "precio": 200, "activo": true },

    { "id": 3, "codigo": "SRV-002", "servicio": "Cambio de filtro de cabina", "tipoVehiculo": "Auto", "precio": 20, "activo": true },
    { "id": 4, "codigo": "SRV-002", "servicio": "Cambio de filtro de cabina", "tipoVehiculo": "Camioneta", "precio": 25, "activo": true },

    { "id": 5, "codigo": "SRV-003", "servicio": "Alineamiento de luces", "tipoVehiculo": "Auto", "precio": 90, "activo": true },
    { "id": 6, "codigo": "SRV-003", "servicio": "Alineamiento de luces", "tipoVehiculo": "Camioneta", "precio": 90, "activo": true },

    { "id": 7, "codigo": "SRV-004", "servicio": "Cambio de amortiguadores delanteros", "tipoVehiculo": "Auto", "precio": 280, "activo": true },
    { "id": 8, "codigo": "SRV-004", "servicio": "Cambio de amortiguadores delanteros", "tipoVehiculo": "Camioneta", "precio": 320, "activo": true },

    { "id": 9, "codigo": "SRV-005", "servicio": "Cambio de amortiguadores posteriores", "tipoVehiculo": "Auto", "precio": 240, "activo": true },
    { "id": 10, "codigo": "SRV-005", "servicio": "Cambio de amortiguadores posteriores", "tipoVehiculo": "Camioneta", "precio": 280, "activo": true },

    { "id": 11, "codigo": "SRV-006", "servicio": "Cambio de kit de distribución", "tipoVehiculo": "Auto", "precio": 550, "activo": true },
    { "id": 12, "codigo": "SRV-006", "servicio": "Cambio de kit de distribución", "tipoVehiculo": "Camioneta", "precio": 700, "activo": true },

    { "id": 13, "codigo": "SRV-007", "servicio": "Cambio de kit de embrague", "tipoVehiculo": "Auto", "precio": 500, "activo": true },
    { "id": 14, "codigo": "SRV-007", "servicio": "Cambio de kit de embrague", "tipoVehiculo": "Camioneta", "precio": 680, "activo": true },

    { "id": 15, "codigo": "SRV-008", "servicio": "Cambio de aceite de corona delantero y posterior", "tipoVehiculo": "Auto", "precio": 60, "activo": true },
    { "id": 16, "codigo": "SRV-008", "servicio": "Cambio de aceite de corona delantero y posterior", "tipoVehiculo": "Camioneta", "precio": 60, "activo": true },

    { "id": 17, "codigo": "SRV-009", "servicio": "Cambio de aceite de transferencia", "tipoVehiculo": "Auto", "precio": 60, "activo": true },
    { "id": 18, "codigo": "SRV-009", "servicio": "Cambio de aceite de transferencia", "tipoVehiculo": "Camioneta", "precio": 60, "activo": true },

    { "id": 19, "codigo": "SRV-010", "servicio": "Cambio de aceite de dirección hidráulica", "tipoVehiculo": "Auto", "precio": 60, "activo": true },
    { "id": 20, "codigo": "SRV-010", "servicio": "Cambio de aceite de dirección hidráulica", "tipoVehiculo": "Camioneta", "precio": 60, "activo": true },

    { "id": 21, "codigo": "SRV-011", "servicio": "Cambio de aceite de caja", "tipoVehiculo": "Auto", "precio": 60, "activo": true },
    { "id": 22, "codigo": "SRV-011", "servicio": "Cambio de aceite de caja", "tipoVehiculo": "Camioneta", "precio": 60, "activo": true }
  ]



  filtroTexto: string = '';
  filtroEstado: string = '';
  filtroGenero: string = '';

  paginaActual = 1;
  filasPorPagina = 50;

  roleCode: string | null = null;

  constructor(private sidebarService: SidebarService, private dialog: MatDialog, private clienteService: ClienteService, private snackBar: MatSnackBar) {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    this.roleCode = user?.roleCode;
  }

  ngOnInit() {
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


  openCreateDialog() {
    const dialogRef = this.dialog.open(ModalClientesDialogComponent, {
      width: '1500px',
      panelClass: 'full-modal'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }
  paginaSiguiente() {
    if (this.paginaActual * this.filasPorPagina < this.manoDeObra.length) this.paginaActual++;
  }
  openMenu() {
    this.sidebarService.toggleSidenav();
  }

  openHijosDialog(cliente: any, modo: 'listar' | 'agregar') {
    const dialogRef = this.dialog.open(ModalHijosDialogComponent, {
      width: '400px',
      data: { cliente, modo }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
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
      width: '1500px',
      data: item
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }
}
