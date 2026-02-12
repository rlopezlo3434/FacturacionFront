import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClienteService } from '../../../../../../services/cliente.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-modal-hijos-dialog',
  templateUrl: './modal-hijos-dialog.component.html',
  styleUrl: './modal-hijos-dialog.component.scss'
})
export class ModalHijosDialogComponent {
  hijos: any[] = [];
  newChild = { id: null, firstName: '', lastName: '', fechaCumpleanios: null, genero: '' };
  isAgregar: boolean = false;
  isEditar: boolean = false;
  hijoSeleccionado: any = null;

  constructor(
    private dialogRef: MatDialogRef<ModalHijosDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private clienteService: ClienteService,
    private snackBar: MatSnackBar
  ) {
    console.log(data)
    this.isAgregar = data.modo === 'agregar';
    console.log(this.isAgregar)
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

  editarHijo(hijo: any) {
  this.isEditar = true;
  this.isAgregar = false;

  this.newChild = {
    id: hijo.id,
    firstName: hijo.firstName,
    lastName: hijo.lastName,
    fechaCumpleanios: hijo.fechaCumpleanios
      ? hijo.fechaCumpleanios.substring(0, 10)
      : null,
    genero: hijo.genero || ''   // ✅ NUEVO
  };
}

  updateHijo() {
    this.clienteService.updateChild(this.newChild).subscribe({
      next: () => {
        this.isEditar = false;
        this.resetForm();
        this.loadHijos(); // vuelve a listar
        this.snackBar.open(
            'Datos del hijo actualizado correctamente',
            '',
            {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['success-snackbar']
            }
          );
      },
      error: () => {
        console.log('Error al actualizar el hijo');
      }
    });
  }

  resetForm() {
    this.newChild = {
      id: null,
      firstName: '',
      lastName: '',
      fechaCumpleanios: null,
      genero: ''   // ✅ NUEVO
    };
  }


  addHijo() {
    if (!this.newChild.firstName.trim() || !this.newChild.lastName.trim()) {
      return;
    }

    const params = {
      firstName: this.newChild.firstName.trim(),
      lastName: this.newChild.lastName.trim(),
      fechaCumpleanios: this.newChild.fechaCumpleanios || null,
      clientId: this.data.cliente.id,
      genero: this.newChild.genero || ''   // ✅ NUEVO

    };

    this.clienteService.createChildren(params).subscribe({
      next: (response) => {
        this.dialogRef.close(response);

        this.newChild = { id: null, firstName: '', lastName: '', fechaCumpleanios: null, genero: '' };
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
