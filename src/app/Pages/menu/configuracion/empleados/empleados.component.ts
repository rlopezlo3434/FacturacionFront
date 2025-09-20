import { Component } from '@angular/core';
import { ModalEmpleadoDialogComponent } from './modal-empleado-dialog/modal-empleado-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrl: './empleados.component.scss'
})
export class EmpleadosComponent {

  empleados = [
    { nroDocumento: 'Servicio', nombre: 'Corte de Cabello', estado: 'Suspendido', fecha: '2025-09-17' },
    { nroDocumento: 'Servicio', nombre: 'Lavado de Cabello', estado: 'Activo', fecha: '2025-09-16' },
    { nroDocumento: 'Producto', nombre: 'Shampoo', estado: 'Suspendido', fecha: '2025-09-15' },
    { nroDocumento: 'Servicio', nombre: 'Peinado', estado: 'Activo', fecha: '2025-09-14' },
    { nroDocumento: 'Producto', nombre: 'Acondicionador', estado: 'Suspendido', fecha: '2025-09-13' },
    { nroDocumento: 'Servicio', nombre: 'Lavado de Cabello', estado: 'Activo', fecha: '2025-09-16' },
    { nroDocumento: 'Producto', nombre: 'Shampoo', estado: 'Suspendido', fecha: '2025-09-15' },
    { nroDocumento: 'Servicio', nombre: 'Peinado', estado: 'Activo', fecha: '2025-09-14' },
    { nroDocumento: 'Producto', nombre: 'Acondicionador', estado: 'Suspendido', fecha: '2025-09-13' },
  ];

  paginaActual = 1;
  filasPorPagina = 5;

  constructor(private dialog: MatDialog) { }
  
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
          this.empleados.push(result);
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
          // this.items[index] = result; // reemplaza el item editado
        }
      });
    }

}
