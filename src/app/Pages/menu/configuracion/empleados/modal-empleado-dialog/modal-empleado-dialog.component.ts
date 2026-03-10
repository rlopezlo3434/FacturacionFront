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
      console.log('Datos recibidos para edición:', data);
      this.emp = {
        id: data.id,
        names: data.names,
        documentIdentificationType: data.documentIdentificationType === 'Dni' ? 'DNI' : data.documentIdentificationType === 'Ruc' ? 'RUC' : 'CARNET_EXTRANJERIA',
        documentIdentificationNumber: data.documentNumber,
        email: data.email,
        gender: data.typeGender === 'Male' ? 'M' : 'F',
        roleCode: data.roleCode
      };

    } else {

      this.emp = {
        names: '',
        documentIdentificationType: '',
        documentIdentificationNumber: '',
        email: '',
        gender: '',
        roleCode: '',
        username: ''
      };

    }

  }

   guardar() {

    const request = {

      names: this.emp.names,
      documentIdentificationType: this.emp.documentIdentificationType,
      documentIdentificationNumber: this.emp.documentIdentificationNumber,
      email: this.emp.email,
      gender: this.emp.gender,
      roleCode: this.emp.roleCode,
      password: this.password || undefined

    };

    const accion = this.data
      ? this.empleadosService.updateEmpleado(this.emp.id, request)
      : this.empleadosService.createEmpleado({
          ...request,
          username: this.emp.username
        });

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

        console.error(`Error al ${mensajeAccion} empleado`, error);

        this.snackBar.open(
          error.error?.message || `Error al ${mensajeAccion} empleado`,
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

  cancelar() {
    this.dialogRef.close();
  }


}
