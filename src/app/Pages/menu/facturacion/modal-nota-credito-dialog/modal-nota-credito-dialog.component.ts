import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-nota-credito-dialog',
  templateUrl: './modal-nota-credito-dialog.component.html',
  styleUrl: './modal-nota-credito-dialog.component.scss'
})
export class ModalNotaCreditoDialogComponent {
  reemplazadoPor = '';
  error = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ModalNotaCreditoDialogComponent>
  ) { }

  confirmar() {
    const valor = (this.reemplazadoPor || '').trim().toUpperCase();

    if (valor && !/^[FB]\w*-\d+$/.test(valor)) {
      this.error = 'Formato inválido. Ejemplo: F002-00000015 o B002-00000010.';
      return;
    }

    this.dialogRef.close({ confirmed: true, reemplazadoPor: valor || null });
  }

  cerrar() {
    this.dialogRef.close();
  }
}
