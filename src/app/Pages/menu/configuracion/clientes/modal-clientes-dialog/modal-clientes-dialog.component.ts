import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClienteService } from '../../../../../../services/cliente.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-modal-clientes-dialog',
  templateUrl: './modal-clientes-dialog.component.html',
  styleUrl: './modal-clientes-dialog.component.scss'
})
export class ModalClientesDialogComponent {
  cli: any = {};
  password = '';
  hide = true;
  roleCode: string | null = null;


  constructor(
    public dialogRef: MatDialogRef<ModalClientesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private clienteService: ClienteService,
    private snackBar: MatSnackBar
  ) {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    this.roleCode = user?.roleCode;
    if (data) {
      // Editar
      console.log(data)
      this.cli = { ...data };
    } else {
      // Crear
      this.cli = {
        firstName: '',
        lastName: '',
        documentIdentificationType: '',
        documentIdentificationNumber: '',
        email: '',
        gender: '',
        numbers: ['']
      };
    }
  }

  addNumber() {
    this.cli.numbers.push('');
  }

  removeNumber(index: number) {
    this.cli.numbers.splice(index, 1);
  }

  guardar() {
    const cliente = {
      firstName: this.cli.firstName,
      lastName: this.cli.lastName,
      documentIdentificationNumber: this.cli.documentIdentificationNumber,
      documentIdentificationType: this.cli.documentIdentificationType,
      gender: this.cli.gender,
      email: this.cli.email,
      acceptsMarketing: this.cli.acceptsMarketing || false,
      numbers: this.cli.numbers.filter((num: string) => num && num.trim() !== '')
    };

    // creación o edición
    const accion = this.data
      ? this.clienteService.updateCliente(this.cli.id, cliente)
      : this.clienteService.createCliente(cliente);

    const mensajeAccion = this.data ? 'actualizado' : 'creado';

    accion.subscribe({
      next: (response: any) => {
        const success = response?.success;
        const message = response?.message || `Cliente ${mensajeAccion} correctamente`;

        this.snackBar.open(message, '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: [success ? 'success-snackbar' : 'error-snackbar']
        });

        if (success) this.dialogRef.close(true);
      },
      error: (error) => {
        console.error(`Error al ${mensajeAccion} cliente:`, error);
        this.snackBar.open(error.error?.message || `Error al ${mensajeAccion} cliente`, '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  cancelar() {
    this.dialogRef.close();
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  consultarDocumento() {
    this.clienteService.consultarDocumento(this.cli.documentIdentificationType, this.cli.documentIdentificationNumber)
      .subscribe({
        next: (response: any) => {

          // 1️⃣ Validar error del backend
          if (response?.message === 'not found') {
            this.snackBar.open(
              'No se encontraron datos para el documento proporcionado',
              '',
              {
                duration: 3000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
                panelClass: ['error-snackbar']
              }
            );
            return; // IMPORTANTE: detener el flujo
          }

          // 2️⃣ Si sí existen datos, llenar el formulario
          this.cli.firstName = response.first_name + ' ' + response.first_last_name || response.razon_social || '';
          // this.cli.lastName = response.first_last_name || '';

          this.snackBar.open(
            'Datos del documento cargados correctamente',
            '',
            {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['success-snackbar']
            }
          );
        },

        // 3️⃣ Si es un error HTTP (404, 500, etc.)
        error: (err) => {
          this.snackBar.open(
            'Error al consultar el documento',
            '',
            {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['error-snackbar']
            }
          );
        }
      });
  }

}
