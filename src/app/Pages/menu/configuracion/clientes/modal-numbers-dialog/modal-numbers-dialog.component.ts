import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { ClienteService } from '../../../../../../services/cliente.service';

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
    private clientService: ClienteService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log('Datos recibidos en el diálogo:', data);
    this.numbers = [...(data.cliente.numbers || [])];
  }

  addNumber() {
    if (!this.newNumber || this.newNumber.trim() === '') return;

    this.numbers.push(this.newNumber.trim());
    this.newNumber = '';
  }

  removeNumber(index: number) {

    const number = this.numbers[index];

    this.clientService
      .deleteClientNumber(this.data.cliente.id, number)
      .subscribe({
        next: () => {
          this.numbers.splice(index, 1);
          this.dialogRef.close(true);
        },
        error: () => {
          alert('Error al eliminar número');
        }
      });

  }

  save() {

    const nuevos = this.numbers.filter(
      n => !this.data.cliente.numbers.includes(n)
    );

    const requests = nuevos.map(num =>
      this.clientService.createClientNumber(this.data.cliente.id, {
        number: num
      })
    );

    forkJoin(requests).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => alert('Error al guardar números')
    });

  }

  cancel() {
    this.dialogRef.close();
  }
}
