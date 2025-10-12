import { Component } from '@angular/core';
import { Item } from '../../../../../Models/Item';
import { ModalItemDialogComponent } from '../modal-item-dialog/modal-item-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ItemsService } from '../../../../../../services/items.service';

@Component({
  selector: 'app-items-admin',
  templateUrl: './items-admin.component.html',
  styleUrl: './items-admin.component.scss'
})
export class ItemsAdminComponent {
  items: Item[] = [];
  paginaActual = 1;
  filasPorPagina = 10;

  constructor(private dialog: MatDialog, private itemsService: ItemsService) {

  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(ModalItemDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El diálogo se cerró', result);
      if (result) {
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


  paginaAnterior() {
    if (this.paginaActual > 1) this.paginaActual--;
  }

  paginaSiguiente() {
    if (this.paginaActual * this.filasPorPagina < this.items.length) this.paginaActual++;
  }
}
