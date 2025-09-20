import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalItemDialogComponent } from './modal-item-dialog/modal-item-dialog.component';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrl: './items.component.scss'
})
export class ItemsComponent {

  items = [
    { tipo: 'servicio', descripcion: 'Corte de Cabello', estado: 'Suspendido', fecha: '2025-09-17' },
    { tipo: 'servicio', descripcion: 'Lavado de Cabello', estado: 'Activo', fecha: '2025-09-16' },
    { tipo: 'producto', descripcion: 'Shampoo', estado: 'Suspendido', fecha: '2025-09-15' },
    { tipo: 'servicio', descripcion: 'Peinado', estado: 'Activo', fecha: '2025-09-14' },
    { tipo: 'producto', descripcion: 'Acondicionador', estado: 'Suspendido', fecha: '2025-09-13' },
    { tipo: 'servicio', descripcion: 'Lavado de Cabello', estado: 'Activo', fecha: '2025-09-16' },
    { tipo: 'producto', descripcion: 'Shampoo', estado: 'Suspendido', fecha: '2025-09-15' },
    { tipo: 'servicio', descripcion: 'Peinado', estado: 'Activo', fecha: '2025-09-14' },
    { tipo: 'producto', descripcion: 'Acondicionador', estado: 'Suspendido', fecha: '2025-09-13' },
    { tipo: 'servicio', descripcion: 'Lavado de Cabello', estado: 'Activo', fecha: '2025-09-16' },
    { tipo: 'producto', descripcion: 'Shampoo', estado: 'Suspendido', fecha: '2025-09-15' },
    { tipo: 'servicio', descripcion: 'Peinado', estado: 'Activo', fecha: '2025-09-14' },
    { tipo: 'producto', descripcion: 'Acondicionador', estado: 'Suspendido', fecha: '2025-09-13' },
  ];

  paginaActual = 1;
  filasPorPagina = 5;

  constructor(private dialog: MatDialog) { }

  paginaAnterior() {
    if (this.paginaActual > 1) this.paginaActual--;
  }

  paginaSiguiente() {
    if (this.paginaActual * this.filasPorPagina < this.items.length) this.paginaActual++;
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(ModalItemDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.items.push(result);
      }
    });
  }

  openEditDialog(item: any) {
    const dialogRef = this.dialog.open(ModalItemDialogComponent, {
      width: '400px',
      data: item
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.items[index] = result; // reemplaza el item editado
      }
    });
  }
}
