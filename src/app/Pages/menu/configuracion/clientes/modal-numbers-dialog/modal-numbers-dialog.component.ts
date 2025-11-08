import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-numbers-dialog',
  templateUrl: './modal-numbers-dialog.component.html',
  styleUrl: './modal-numbers-dialog.component.scss'
})
export class ModalNumbersDialogComponent {
  numbers: string[] = [];
  newNumber: string = '';

  constructor(
    private dialogRef: MatDialogRef<ModalNumbersDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.numbers = [...(data.cliente.numbers || [])];
  }

  addNumber() {
    if (this.newNumber.trim() !== '') {
      this.numbers.push(this.newNumber.trim());
      this.newNumber = '';
    }
  }

  removeNumber(index: number) {
    this.numbers.splice(index, 1);
  }

  save() {
    this.dialogRef.close(this.numbers);
  }

  cancel() {
    this.dialogRef.close();
  }
}
