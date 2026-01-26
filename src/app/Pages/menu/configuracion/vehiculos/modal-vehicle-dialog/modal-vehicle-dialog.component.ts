import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClienteService } from '../../../../../../services/cliente.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VehiculoService } from '../../../../../../services/vehiculo.service';
import { CatalogosService } from '../../../../../../services/catalogos.service';

@Component({
  selector: 'app-modal-vehicle-dialog',
  templateUrl: './modal-vehicle-dialog.component.html',
  styleUrl: './modal-vehicle-dialog.component.scss'
})
export class ModalVehicleDialogComponent {
vehicle: any = {
    id: 0,
    plate: '',
    brandId: null,
    modelId: null,
    year: null,
    color: '',
    currentMileageKm: null,
    ownerClientId: null,
    isActive: true
  };

  brands: any[] = [];
  models: any[] = [];
  clients: any[] = [];

  selectedBrandId: number | null = null;

  constructor(
    public dialogRef: MatDialogRef<ModalVehicleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private catalogService: CatalogosService,
    private vehicleService: VehiculoService,
    private clienteService: ClienteService
  ) {}

  ngOnInit(): void {
    this.loadBrands();
    this.loadClients();

    // ✅ Editar
    if (this.data?.id) {
      this.vehicle = {
        id: this.data.id,
        plate: this.data.plate,
        modelId: this.data.model?.id ?? this.data.modelId,
        year: this.data.year,
        color: this.data.color,
        currentMileageKm: this.data.currentMileageKm,
        ownerClientId: this.data.owner?.id ?? this.data.ownerClientId,
        isActive: this.data.isActive
      };

      // Brand viene por model.brand o por brand directo si lo mandas así
      this.selectedBrandId = this.data.brand?.id ?? this.data.brandId ?? this.data.model?.brandId ?? null;

      if (this.selectedBrandId) {
        this.loadModelsByBrand(this.selectedBrandId);
      }
    }

    // ✅ Crear (si viene con brandId preseleccionado)
    if (!this.data?.id && this.data?.brandId) {
      this.selectedBrandId = this.data.brandId;
      this.loadModelsByBrand(this.selectedBrandId!);
    }
  }

  loadBrands() {
    this.catalogService.getBrands().subscribe((res: any) => {
      this.brands = res.data || [];
    });
  }

  loadModelsByBrand(brandId: number) {
    this.catalogService.getModelsByBrand(brandId).subscribe((res: any) => {
      this.models = res.data || [];
    });
  }

  loadClients() {
    // ✅ si tú tienes "GetClientByEstablishment", aquí solo consumes tu lista de clientes
    this.clienteService.getClientesByEstablishment().subscribe((res: any) => {
      this.clients = res.data || res || [];
    });
  }

  onBrandChange() {
    if (!this.selectedBrandId) {
      this.models = [];
      this.vehicle.modelId = null;
      return;
    }

    this.vehicle.modelId = null;
    this.loadModelsByBrand(this.selectedBrandId);
  }

  guardar() {
    // ✅ aquí guardamos BrandId y ModelId
    this.vehicle.brandId = this.selectedBrandId;
    
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    const payload = {
      plate: this.vehicle.plate.trim().toUpperCase(),
      establishmentId: user?.establishment.id,
      brandId: this.vehicle.brandId,
      modelId: this.vehicle.modelId,
      year: Number(this.vehicle.year),
      color: this.vehicle.color,
      currentMileageKm: this.vehicle.currentMileageKm ? Number(this.vehicle.currentMileageKm) : null,
      ownerClientId: this.vehicle.ownerClientId,
      isActive: this.vehicle.isActive
    };

    const accion = this.data?.id
      ? this.vehicleService.updateVehicle(this.vehicle.id, payload)
      : this.vehicleService.createVehicle(payload);

    const mensajeAccion = this.data?.id ? 'actualizado' : 'creado';

    accion.subscribe({
      next: (resp: any) => {
        const success = resp?.success;
        const message = resp?.message || `Vehículo ${mensajeAccion} correctamente`;

        this.snackBar.open(message, '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: [success ? 'success-snackbar' : 'error-snackbar']
        });

        if (success) this.dialogRef.close(true);
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || `Error al guardar vehículo`, '', {
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
