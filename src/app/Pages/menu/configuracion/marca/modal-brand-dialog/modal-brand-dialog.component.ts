import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VehiculoService } from '../../../../../../services/vehiculo.service';

@Component({
  selector: 'app-modal-brand-dialog',
  templateUrl: './modal-brand-dialog.component.html',
  styleUrl: './modal-brand-dialog.component.scss'
})
export class ModalBrandDialogComponent {
  brand: any = {
    name: '',
    isActive: true
  };

  constructor(
    public dialogRef: MatDialogRef<ModalBrandDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private vehiculeService: VehiculoService
  ) {
    // ✅ Editar
    if (data) {
      this.brand = { ...data };
    }
  }

  guardar() {
    const payload = {
      name: this.brand.name.trim()
    };

    const accion = this.data
      ? this.vehiculeService.updateBrand(this.brand.id, { ...payload, isActive: this.brand.isActive })
      : this.vehiculeService.createBrand(payload);

    const mensajeAccion = this.data ? 'actualizada' : 'creada';

    accion.subscribe({
      next: (resp: any) => {
        const success = resp?.success;
        const message = resp?.message || `Marca ${mensajeAccion} correctamente`;

        this.snackBar.open(message, '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: [success ? 'success-snackbar' : 'error-snackbar']
        });

        if (success) this.dialogRef.close(true);
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || `Error al guardar marca`, '', {
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
