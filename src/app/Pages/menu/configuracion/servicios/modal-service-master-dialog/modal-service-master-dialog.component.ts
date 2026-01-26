import { Component, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServicesServiceService } from '../../../../../../services/services-service.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-service-master-dialog',
  templateUrl: './modal-service-master-dialog.component.html',
  styleUrl: './modal-service-master-dialog.component.scss'
})
export class ModalServiceMasterDialogComponent {
service: any = {
    name: '',
    price: null,
    isActive: true
  };

  constructor(
    public dialogRef: MatDialogRef<ModalServiceMasterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private serviceMaster: ServicesServiceService,
    private snackBar: MatSnackBar
  ) {

    if (data) {
      this.service = {
        name: data.name,
        price: data.price,
        isActive: data.isActive
      };
    }
  }

  guardar() {

    const payload = {
      name: this.service.name,
      price: Number(this.service.price),
      isActive: this.service.isActive
    };

    const accion = this.data
      ? this.serviceMaster.updateService(this.data.id, payload)
      : this.serviceMaster.createService(payload);

    const mensaje = this.data ? 'Servicio actualizado' : 'Servicio creado';

    accion.subscribe({
      next: (resp: any) => {
        this.snackBar.open(resp?.message || mensaje, '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });

        this.dialogRef.close(true);
      },
      error: (err: any) => {
        this.snackBar.open(err.error?.message || 'Error', '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });

  }

  cancelar() {
    this.dialogRef.close(false);
  }
}
