import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProveedorService } from '../../../../../../services/proveedor.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClienteService } from '../../../../../../services/cliente.service';

@Component({
  selector: 'app-modal-proveedor-dialog',
  templateUrl: './modal-proveedor-dialog.component.html',
  styleUrl: './modal-proveedor-dialog.component.scss'
})
export class ModalProveedorDialogComponent {
  prov: any = {
    ruc: '',
    razonSocial: '',
    numero: '',
    activo: true
  };

  constructor(
    public dialogRef: MatDialogRef<ModalProveedorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private proveedorService: ProveedorService,
    private clienteService: ClienteService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {

    if (this.data) {
      this.prov = { ...this.data };
    }

  }

  consultarDocumento() {
    
    this.clienteService.consultarDocumento('Ruc', this.prov.ruc)
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

          const fullName = `${response?.first_name ?? ''} ${response?.first_last_name ?? ''}`.trim();

          this.prov.razonSocial = fullName || response.razon_social || '';
          
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
        error: (err: any) => {
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

  guardar() {

    if (!this.prov.ruc || !this.prov.razonSocial) {
      this.snackBar.open('Complete los campos obligatorios', '', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
      return;
    }

    if (this.data) {

      this.proveedorService.updateProveedor(this.data.id, this.prov)
        .subscribe({
          next: () => {

            this.snackBar.open('Proveedor actualizado correctamente', '', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['success-snackbar']
            });

            this.dialogRef.close(true);

          },
          error: () => {

            this.snackBar.open('Error al actualizar proveedor', '', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['error-snackbar']
            });

          }
        });

    } else {

      this.proveedorService.createProveedor(this.prov)
        .subscribe({
          next: () => {

            this.snackBar.open('Proveedor creado correctamente', '', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['success-snackbar']
            });

            this.dialogRef.close(true);

          },
          error: () => {

            this.snackBar.open('Error al crear proveedor', '', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['error-snackbar']
            });

          }
        });

    }

  }

  cancelar() {
    this.dialogRef.close();
  }

  consultarRuc() {

    if (!this.prov.ruc || this.prov.ruc.length !== 11) {

      this.snackBar.open('Ingrese un RUC válido', '', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });

      return;
    }

    // this.proveedorService.getRuc(this.prov.ruc)
    //   .subscribe({
    //     next: (data: any) => {

    //       if (data) {
    //         this.prov.razonSocial = data.razonSocial;
    //       }

    //     },
    //     error: () => {

    //       this.snackBar.open('No se pudo consultar el RUC', '', {
    //         duration: 3000,
    //         horizontalPosition: 'right',
    //         verticalPosition: 'top',
    //         panelClass: ['error-snackbar']
    //       });

    //     }
    //   });

  }
}
