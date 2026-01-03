import { Component } from '@angular/core';
import { ModalHijosDialogComponent } from '../clientes/modal-hijos-dialog/modal-hijos-dialog.component';
import { ModalClientesDialogComponent } from '../clientes/modal-clientes-dialog/modal-clientes-dialog.component';
import { ModalNumbersDialogComponent } from '../clientes/modal-numbers-dialog/modal-numbers-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ClienteService } from '../../../../../services/cliente.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SidebarService } from '../../../../../services/sidebar.service';

@Component({
  selector: 'app-vehiculos',
  templateUrl: './vehiculos.component.html',
  styleUrl: './vehiculos.component.scss'
})
export class VehiculosComponent {

  vehiculos = [
    {
      modelo: 'Toyota Yaris',
      anio: 2023,
      color: 'Gris Oscuro',
      placa: 'ABC-1234',
      km: '12,450 KM',
      ultimoServicio: '10-10-2025',
      proximoServicio: '10-12-2025',
      imagen: 'https://hyundai.pe/wp-content/uploads/2024/02/New-TUCSON-carro-familia-viaje.webp'
    },
    {
      modelo: 'Hyundai Tucson',
      anio: 2024,
      color: 'Negro',
      placa: 'XYZ-9876',
      km: '5,200 KM',
      ultimoServicio: '20-09-2025',
      proximoServicio: '20-11-2025',
      imagen: 'https://hyundai.pe/wp-content/uploads/2024/02/New-TUCSON-carro-familia-viaje.webp'
    },
    {
      modelo: 'Hyundai Tucson',
      anio: 2024,
      color: 'Negro',
      placa: 'XYZ-9876',
      km: '5,200 KM',
      ultimoServicio: '20-09-2025',
      proximoServicio: '20-11-2025',
      imagen: 'https://hyundai.pe/wp-content/uploads/2024/02/New-TUCSON-carro-familia-viaje.webp'
    },
    {
      modelo: 'Hyundai Tucson',
      anio: 2024,
      color: 'Negro',
      placa: 'XYZ-9876',
      km: '5,200 KM',
      ultimoServicio: '20-09-2025',
      proximoServicio: '20-11-2025',
      imagen: 'https://hyundai.pe/wp-content/uploads/2024/02/New-TUCSON-carro-familia-viaje.webp'
    },
    {
      modelo: 'Hyundai Tucson',
      anio: 2024,
      color: 'Negro',
      placa: 'XYZ-9876',
      km: '5,200 KM',
      ultimoServicio: '20-09-2025',
      proximoServicio: '20-11-2025',
      imagen: 'https://hyundai.pe/wp-content/uploads/2024/02/New-TUCSON-carro-familia-viaje.webp'
    },
    {
      modelo: 'Hyundai Tucson',
      anio: 2024,
      color: 'Negro',
      placa: 'XYZ-9876',
      km: '5,200 KM',
      ultimoServicio: '20-09-2025',
      proximoServicio: '20-11-2025',
      imagen: 'https://hyundai.pe/wp-content/uploads/2024/02/New-TUCSON-carro-familia-viaje.webp'
    },
    {
      modelo: 'Hyundai Tucson',
      anio: 2024,
      color: 'Negro',
      placa: 'XYZ-9876',
      km: '5,200 KM',
      ultimoServicio: '20-09-2025',
      proximoServicio: '20-11-2025',
      imagen: 'https://hyundai.pe/wp-content/uploads/2024/02/New-TUCSON-carro-familia-viaje.webp'
    },
    {
      modelo: 'Hyundai Tucson',
      anio: 2024,
      color: 'Negro',
      placa: 'XYZ-9876',
      km: '5,200 KM',
      ultimoServicio: '20-09-2025',
      proximoServicio: '20-11-2025',
      imagen: 'https://hyundai.pe/wp-content/uploads/2024/02/New-TUCSON-carro-familia-viaje.webp'
    }
  ];


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
