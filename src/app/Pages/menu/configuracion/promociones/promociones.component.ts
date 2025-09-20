import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalPromocionesDialogComponent } from './modal-promociones-dialog/modal-promociones-dialog.component';

@Component({
  selector: 'app-promociones',
  templateUrl: './promociones.component.html',
  styleUrl: './promociones.component.scss'
})
export class PromocionesComponent {
  
  promociones = [
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
    if (this.paginaActual * this.filasPorPagina < this.promociones.length) this.paginaActual++;
  }

  openCreateDialog() {
        const dialogRef = this.dialog.open(ModalPromocionesDialogComponent, {
          width: '1500px',
          panelClass: 'full-modal'
        });
    
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.promociones.push(result);
          }
        });
      }
    
      openEditDialog(item: any) {
        const dialogRef = this.dialog.open(ModalPromocionesDialogComponent, {
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
