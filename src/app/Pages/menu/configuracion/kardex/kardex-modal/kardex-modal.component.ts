import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-kardex-modal',
  templateUrl: './kardex-modal.component.html',
  styleUrl: './kardex-modal.component.scss'
})
export class KardexModalComponent {
  movimiento = {
    ItemId: 0,
    movementType: 'Entrada',
    quantity: 0,
    notes: ''
  };

  constructor(
    public dialogRef: MatDialogRef<KardexModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log('Datos recibidos en el modal:', data);
    this.movimiento.ItemId = data.itemId;
  }

  guardar() {
    this.dialogRef.close(this.movimiento);
  }

  cancelar() {
    this.dialogRef.close(null);
  }


}
