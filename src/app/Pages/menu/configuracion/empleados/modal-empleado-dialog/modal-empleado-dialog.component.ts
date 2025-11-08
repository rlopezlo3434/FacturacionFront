import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EmpleadosService } from '../../../../../../services/empleados.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-modal-empleado-dialog',
  templateUrl: './modal-empleado-dialog.component.html',
  styleUrl: './modal-empleado-dialog.component.scss'
})
export class ModalEmpleadoDialogComponent {
  emp: any = {};
  password = '';
  hide = true;
  roleCode: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<ModalEmpleadoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private empleadosService: EmpleadosService,
    private snackBar: MatSnackBar
  ) {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    this.roleCode = user?.roleCode;
    if (data) {
      // Editar
      this.emp = { ...data };
    } else {
      // Crear
      this.emp = {
        name: '',
        lastName: '',
        typeGender: '',
        documentIdentificationType: '',
        documentNumber: '',
        email: '',
        username: '',
        roleCode: '',
      };
    }
  }

  guardar() {
    const empleado = {
      firstName: this.emp.name,
      lastName: this.emp.lastName,
      documentIdentificationNumber: this.emp.documentNumber,
      documentIdentificationType: this.emp.documentIdentificationType,
      gender: this.emp.typeGender,
      email: this.emp.email,
      roleCode: this.emp.roleCode,
      password: this.password || undefined,
      username: !this.data ? this.emp.username : undefined
    };

    // creación o edición
    const accion = this.data
      ? this.empleadosService.updateEmpleado(this.emp.id, empleado)
      : this.empleadosService.createEmpleado(empleado);

    const mensajeAccion = this.data ? 'actualizado' : 'creado';

    accion.subscribe({
      next: (response: any) => {
        const success = response?.success;
        const message = response?.message || `Empleado ${mensajeAccion} correctamente`;

        this.snackBar.open(message, '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: [success ? 'success-snackbar' : 'error-snackbar']
        });

        if (success) this.dialogRef.close(true);
      },
      error: (error) => {
        console.error(`Error al ${mensajeAccion} empleado:`, error);
        this.snackBar.open(error.error?.message || `Error al ${mensajeAccion} empleado`, '', {
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


}
