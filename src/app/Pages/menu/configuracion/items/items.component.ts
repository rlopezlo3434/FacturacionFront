import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalItemDialogComponent } from './modal-item-dialog/modal-item-dialog.component';
import { ItemsService } from '../../../../../services/items.service';
import { Item } from '../../../../Models/Item';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrl: './items.component.scss'
})
export class ItemsComponent implements OnInit {

  items: Item[] = [];

  paginaActual = 1;
  filasPorPagina = 10;

  constructor(private dialog: MatDialog, private itemsService: ItemsService) { }

  ngOnInit(): void {
    this.getItemsByEstablishment();
  }


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
      console.log('El diálogo se cerró', result);
      if (result) {
        this.getItemsByEstablishment();
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

  getItemsByEstablishment() {
    this.itemsService.getItemsByEstablishment().subscribe(response => {
      this.items = response;
      console.log('Items obtenidos con éxito', response);
    }, error => {
      console.error('Error al obtener los items', error);
    });
  }
}
