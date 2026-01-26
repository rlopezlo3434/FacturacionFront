import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VehiculoService } from '../../../../../../services/vehiculo.service';

@Component({
  selector: 'app-modal-model-dialog',
  templateUrl: './modal-model-dialog.component.html',
  styleUrl: './modal-model-dialog.component.scss'
})
export class ModalModelDialogComponent {
  model: any = {
    id: 0,
    brandId: null,
    name: '',
    isActive: true
  };

  brands: any[] = [];

  // ✅ si la marca viene seleccionada desde la pantalla principal, ocultamos el selector
  showBrandSelect = true;

  constructor(
    public dialogRef: MatDialogRef<ModalModelDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private vehiculeService: VehiculoService
  ) {}

  ngOnInit(): void {
    console.log('data recibida en modal model:', this.data);
    /**
     * ✅ Si vienes desde:
     * openCreateModelDialog(brandId)
     * puedes enviar { brandId: 2 }
     */
    if (this.data?.brandId && !this.data?.id) {
      this.model.brandId = this.data.brandId;
      this.showBrandSelect = false; // ✅ ya está preseleccionada
    }

    // ✅ Editar
    if (this.data?.id) {
      this.model = {
        id: this.data.id,
        brandId: this.data.brandId,
        name: this.data.name,
        isActive: this.data.isActive
      };
    }

    // cargar marcas solo si se mostrará select
    if (this.showBrandSelect) {
      this.loadBrands();
    }
  }

  loadBrands() {
    this.vehiculeService.getBrands().subscribe((res: any) => {
      this.brands = res.data || [];
    });
  }

  guardar() {
    const payload = {
      name: this.model.name.trim(),
      isActive: this.model.isActive,
      brandId: this.model.brandId
    };

    let accion;

    // ✅ Crear
    if (!this.data?.id) {
      accion = this.vehiculeService.createModel(payload);
    } else {
      // ✅ Editar (si implementas endpoint PUT)
      accion = this.vehiculeService.updateModel(this.model.id, {
        ...payload,
        brandId: this.model.brandId
      });
    }

    const mensajeAccion = this.data?.id ? 'actualizado' : 'creado';

    accion.subscribe({
      next: (resp: any) => {
        const success = resp?.success;
        const message = resp?.message || `Modelo ${mensajeAccion} correctamente`;

        this.snackBar.open(message, '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: [success ? 'success-snackbar' : 'error-snackbar']
        });

        if (success) this.dialogRef.close(true);
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || `Error al guardar modelo`, '', {
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
