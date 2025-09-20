import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-item-dialog',
  templateUrl: './modal-item-dialog.component.html',
  styleUrl: './modal-item-dialog.component.scss'
})
export class ModalItemDialogComponent {
  item = {
    tipo: '',       // 👈 vacío para que aparezca "Seleccione..."
    descripcion: '',
    cantidadInicial: null,
    minStock: null
  };

  constructor(
    public dialogRef: MatDialogRef<ModalItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Si recibimos data, estamos editando
    if (data) {
      this.item = { ...data };
    }
  }

  guardar() {
    this.dialogRef.close(this.item);
  }

  cancelar() {
    this.dialogRef.close();
  }
}
