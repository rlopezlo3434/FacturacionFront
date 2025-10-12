import { Component } from '@angular/core';
import { ModalEmpleadoDialogComponent } from './modal-empleado-dialog/modal-empleado-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { EmpleadosService } from '../../../../../services/empleados.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrl: './empleados.component.scss'
})
export class EmpleadosComponent {

  empleados: any[] = [];

  filtroTexto: string = '';
  filtroEstado: string = '';

  paginaActual = 1;
  filasPorPagina = 5;

  roleCode: string | null = null;

  constructor(private dialog: MatDialog, private empleadosService: EmpleadosService, private snackBar: MatSnackBar) {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    this.roleCode = user?.roleCode;
  }

  ngOnInit() {
    this.loadEmpleados();
  }

  loadEmpleados() {
    this.empleadosService.getEmpleadosByEstablishment().subscribe(data => {
      this.empleados = data;
    });
  }

  updateEstado(empleado: any) {
    this.empleadosService.updateStateEmpleado(empleado.id, empleado.isActive).subscribe({
      next: (response) => {
        this.snackBar.open('Estado actualizado', '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
        this.loadEmpleados();

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

  removerFiltros() {
    this.filtroTexto = '';
    this.filtroEstado = '';
  }

  paginaAnterior() {
    if (this.paginaActual > 1) this.paginaActual--;
  }

  paginaSiguiente() {
    if (this.paginaActual * this.filasPorPagina < this.empleados.length) this.paginaActual++;
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(ModalEmpleadoDialogComponent, {
      width: '1500px',
      panelClass: 'full-modal'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadEmpleados();
      }
    });
  }

  openEditDialog(item: any) {
    const dialogRef = this.dialog.open(ModalEmpleadoDialogComponent, {
      width: '1500px',
      data: item
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadEmpleados();
      }
    });
  }

}
