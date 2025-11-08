import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClienteService } from '../../../../../../services/cliente.service';

@Component({
  selector: 'app-modal-hijos-dialog',
  templateUrl: './modal-hijos-dialog.component.html',
  styleUrl: './modal-hijos-dialog.component.scss'
})
export class ModalHijosDialogComponent {
  hijos: any[] = [];
  newChild = { firstName: '', lastName: '', fechaCumpleanios: '' };
  isAgregar = false;

  constructor(
    private dialogRef: MatDialogRef<ModalHijosDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private clienteService: ClienteService
  ) {
    this.isAgregar = data.modo === 'agregar';
    this.loadHijos();
  }

  loadHijos() {
    this.clienteService.getChildrensByClientId(this.data.cliente.id).subscribe({
      next: (response) => {
        this.hijos = response || [];
      },
      error: (err) => {
        console.error('Error al cargar hijos:', err);
      }
    });
  }

  addHijo() {
    if (!this.newChild.firstName.trim() || !this.newChild.lastName.trim()) {
      return;
    }

    const params = {
      firstName: this.newChild.firstName.trim(),
      lastName: this.newChild.lastName.trim(),
      fechaCumpleanios: this.newChild.fechaCumpleanios || null,
      clientId: this.data.cliente.id

    };

    this.clienteService.createChildren(params).subscribe({
      next: (response) => {
        this.dialogRef.close(response);

        this.newChild = { firstName: '', lastName: '', fechaCumpleanios: '' };
      },
      error: (err) => {
        console.error('Error al agregar hijo:', err);
      }
    });
  }

  removeHijo(index: number) {
    this.hijos.splice(index, 1);
  }

  save() {
    this.dialogRef.close(this.hijos);
  }

  cancel() {
    this.dialogRef.close();
  }
}
