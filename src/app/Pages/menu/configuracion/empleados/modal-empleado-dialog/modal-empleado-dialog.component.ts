import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-empleado-dialog',
  templateUrl: './modal-empleado-dialog.component.html',
  styleUrl: './modal-empleado-dialog.component.scss'
})
export class ModalEmpleadoDialogComponent {
  emp: any = {};
  password = '';
  hide = true;
  constructor(
    public dialogRef: MatDialogRef<ModalEmpleadoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Si recibimos data, estamos editando
    if (data) {
      this.emp = { ...data };
    }
  }

  guardar() {
    this.dialogRef.close(this.emp);
  }

  cancelar() {
    this.dialogRef.close();
  }


}
