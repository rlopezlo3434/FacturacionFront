import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ItemsService } from '../../../../../../services/items.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TiendaService } from '../../../../../../services/tienda.service';

@Component({
  selector: 'app-modal-item-dialog',
  templateUrl: './modal-item-dialog.component.html',
  styleUrl: './modal-item-dialog.component.scss'
})
export class ModalItemDialogComponent {
  item: any = {};

  constructor(
    public dialogRef: MatDialogRef<ModalItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private itemsService: ItemsService,
    private snackBar: MatSnackBar
  ) {
    // Si recibimos data, estamos editando
    if (data) {
      this.item = { ...data };
      console.log('Editando item:', this.item);
    }

    this.item.item == "Servicio" ? this.item.item = "servicio" : this.item.item == "Producto" ? this.item.item = "producto" : this.item.item = "";
  }

  postItems() {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    const params = {
      Item: this.item.item,
      Description: this.item.description,
      EstablishmentId: user?.establishment.id,
      InitialQuantity: this.item.cantidadInicial,
      Value: this.item.value,
      MinStock: this.item.minStock,
      Code: this.item.code || ''
    }

    const action = this.data
      ? this.itemsService.updateItem(params)
      : this.itemsService.postItems(params);

    action.subscribe({
      next: (response: any) => {
        const success = response?.success;
        const message = response?.message;

        this.snackBar.open(message, '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: [success ? 'success-snackbar' : 'error-snackbar']
        });

        if (success) this.dialogRef.close(true);

      },
      error: (error) => {
        this.snackBar.open(error.error?.message, '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });

  }

  guardar() {
    this.postItems();
  }

  cancelar() {
    this.dialogRef.close();
  }
}
