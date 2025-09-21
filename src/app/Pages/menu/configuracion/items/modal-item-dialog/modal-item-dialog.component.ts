import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ItemsService } from '../../../../../../services/items.service';

@Component({
  selector: 'app-modal-item-dialog',
  templateUrl: './modal-item-dialog.component.html',
  styleUrl: './modal-item-dialog.component.scss'
})
export class ModalItemDialogComponent {
  item = {
    tipo: '',       // 👈 vacío para que aparezca "Seleccione..."
    descripcion: '',
    cantidadInicial: 0,
    minStock: 0
  };

  constructor(
    public dialogRef: MatDialogRef<ModalItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private itemsService: ItemsService
  ) {
    // Si recibimos data, estamos editando
    if (data) {
      this.item = { ...data };
    }
  }


  postItems() {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    console.log(user)

    const params = {
      Item: this.item.tipo,
      Description: this.item.descripcion,
      EstablishmentId: user?.establishment.id,
      InitialQuantity: this.item.cantidadInicial,
      MinStock: this.item.minStock
    }

    this.itemsService.postItems(params).subscribe(response => {
      console.log('Items enviados con éxito', response);
    }, error => {
      console.error('Error al enviar los items', error);
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
