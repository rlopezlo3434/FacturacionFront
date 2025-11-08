import { Component, Inject } from '@angular/core';
import { Item } from '../../../../../Models/Item';
import { ModalItemDialogComponent } from '../modal-item-dialog/modal-item-dialog.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ItemsService } from '../../../../../../services/items.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TiendaService } from '../../../../../../services/tienda.service';

@Component({
  selector: 'app-items-admin',
  templateUrl: './items-admin.component.html',
  styleUrl: './items-admin.component.scss'
})
export class ItemsAdminComponent {
  item: any;

  tiendas: any[] = [];
  tiendaSeleccionada: any = '';


  constructor(
    public dialogRef: MatDialogRef<ModalItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private tiendaService: TiendaService,
    private itemsService: ItemsService,
    private snackBar: MatSnackBar
  ) {
    // Si recibimos data, estamos editando
    if (data) {
      this.item = { ...data };
      console.log(this.item)
    }

    this.getEstablishment();

  }

  getEstablishment() {
    this.tiendaService.getEstablishment().subscribe((response: any) => {
      this.tiendas = response;
      console.log('Establecimientos:', response);
    });
  }

  postItems() {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    const params = {
      Item: this.item.tipo == "Servicio" ? "servicio" : "producto",
      Description: this.item.description,
      EstablishmentId: this.tiendaSeleccionada,
      InitialQuantity: this.item.cantidadInicial,
      Value: this.item.precio,
      MinStock: this.item.minStock,
      Code: this.item.code || ''
    }

    // console.log(params)

    this.itemsService.postItems(params).subscribe((response: any) => {
      console.log('Items enviados con éxito', response);
      const success = response?.success;
      const message = response?.message;
      this.snackBar.open(message, '', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: [success ? 'success-snackbar' : 'error-snackbar']
      });
    }, error => {
      console.error('Error al enviar los items', error);
      this.snackBar.open(error.error?.message || 'Error desconocido', '', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
    });

  }



  guardar() {
    this.postItems();
    this.dialogRef.close(this.item);
  }

  cancelar() {
    this.dialogRef.close();
  }
}
