import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalItemDialogComponent } from './modal-item-dialog/modal-item-dialog.component';
import { ItemsService } from '../../../../../services/items.service';
import { Item } from '../../../../Models/Item';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ItemsAdminComponent } from './items-admin/items-admin.component';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrl: './items.component.scss'
})
export class ItemsComponent implements OnInit {

  items: Item[] = [];
  filtroTexto: string = '';
  filtroEstado: string = '';
  filtroTipo: string = '';
  paginaActual = 1;
  filasPorPagina = 10;
  roleCode: string = '';
  constructor(private dialog: MatDialog, private itemsService: ItemsService, private snackBar: MatSnackBar) {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    this.roleCode = user?.roleCode || '';
  }

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
      if (result) {
        setTimeout(() => this.getItemsByEstablishment(), 300);
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
        this.getItemsByEstablishment();

      }
    });
  }

  openAddTienda(item: any) {
    const dialogRef = this.dialog.open(ItemsAdminComponent, {
      width: '400px',
      data: { ...item, cantidadInicial: 0 } // pasar el item con cantidadInicial en 0
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getItemsByEstablishment();
      }
    });
  }

  getItemsByEstablishment() {
    this.itemsService.getItemsByEstablishment().subscribe(response => {
      this.items = response;
    }, error => {
      console.error('Error al obtener los items', error);
    });
  }

  removerFiltros() {
    this.filtroTexto = '';
    this.filtroEstado = '';
    this.filtroTipo = '';
  }

  updateEstado(item: any) {
    this.itemsService.updateStateItem(item.id, item.isActive).subscribe({
      next: (response) => {
        this.snackBar.open('Estado actualizado', '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
        this.getItemsByEstablishment();

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
}
