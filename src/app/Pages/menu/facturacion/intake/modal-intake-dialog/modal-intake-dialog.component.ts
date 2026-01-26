import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VehiculoService } from '../../../../../../services/vehiculo.service';
import { ClienteService } from '../../../../../../services/cliente.service';
import { VehicleIntakeService } from '../../../../../../services/vehicle-intake.service';
import { HostListener } from '@angular/core';
@Component({
  selector: 'app-modal-intake-dialog',
  templateUrl: './modal-intake-dialog.component.html',
  styleUrl: './modal-intake-dialog.component.scss'
})


export class ModalIntakeDialogComponent {
  intake: any = {
    vehicleId: null,
    clientId: null,
    mode: 1, // 1 taller, 2 domicilio
    pickupAddress: '',
    mileageKm: null,
    observations: '',
    inventoryItems: []
  };

  vehicles: any[] = [];
  clients: any[] = [];

  inventoryMaster: any[] = [];
  inventoryVehiculo: any[] = [];
  inventoryAccesorios: any[] = [];

  vehicleSearch = '';
  showVehicleDropdown = false;

  filteredVehicles: any[] = [];
  constructor(
    public dialogRef: MatDialogRef<ModalIntakeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private vehiculoService: VehiculoService,
    private clienteService: ClienteService,
    private intakeService: VehicleIntakeService
  ) { }

  ngOnInit(): void {
    this.loadVehicles();
    this.loadClients();
    this.loadInventoryMaster();

    // ✅ si te mandan vehicleId preseleccionado desde otro lado
    if (this.data?.vehicleId) {
      this.intake.vehicleId = this.data.vehicleId;
    }

    if (this.data?.clientId) {
      this.intake.clientId = this.data.clientId;
    }
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: any) {
    const target = event.target as HTMLElement;

    // si haces click fuera del combo
    if (!target.closest('.combo-box')) {
      this.showVehicleDropdown = false;
    }
  }

  filterVehiclesNative() {
    const t = (this.vehicleSearch || '').toLowerCase().trim();

    if (!t) {
      this.filteredVehicles = this.vehicles.slice(0, 15);
      return;
    }

    this.filteredVehicles = this.vehicles
      .filter(v => {
        const plate = (v.plate || '').toLowerCase();
        const model = (v.model?.name || '').toLowerCase();
        const brand = (v.brand?.name || '').toLowerCase();
        return plate.includes(t) || model.includes(t) || brand.includes(t);
      })
      .slice(0, 30);
  }

  selectVehicle(v: any) {
    this.intake.vehicleId = v.id;

    // ✅ Setear texto bonito en input
    this.vehicleSearch = `${v.plate} - ${v.model?.name} (${v.brand?.name})`;

    // ✅ si tiene dueño, autoselecciona cliente
    if (v.owner?.id) {
      this.intake.clientId = v.owner.id;
    }

    this.showVehicleDropdown = false;
  }
  
  loadVehicles() {
    this.vehiculoService.getVehicles().subscribe((res: any) => {
      this.vehicles = res?.data || [];
    });
  }

  loadClients() {
    this.clienteService.getClientesByEstablishment().subscribe((res: any) => {
      this.clients = res?.data || res || [];
    });
  }

  loadInventoryMaster() {
    this.intakeService.getInventoryMaster().subscribe((res: any) => {
      this.inventoryMaster = res?.data || [];

      // ✅ Inicializar todo en "NO" por defecto
      this.inventoryMaster.forEach(x => x.isPresent = false);

      // ✅ separar por grupos
      this.inventoryVehiculo = this.inventoryMaster.filter(x => x.group === 1);
      this.inventoryAccesorios = this.inventoryMaster.filter(x => x.group === 2);
    });
  }

  setInventory(masterId: number, value: boolean) {
    const item = this.inventoryMaster.find(x => x.id === masterId);
    if (item) item.isPresent = value;
  }

  guardar() {
    const payload = {
      vehicleId: this.intake.vehicleId,
      clientId: this.intake.clientId,
      mode: this.intake.mode,
      pickupAddress: this.intake.mode === 2 ? this.intake.pickupAddress : null,
      mileageKm: Number(this.intake.mileageKm),
      observations: this.intake.observations,
      inventoryItems: this.inventoryMaster.map(x => ({
        inventoryMasterItemId: x.id,
        isPresent: x.isPresent
      }))
    };

    this.intakeService.createIntake(payload).subscribe({
      next: (resp: any) => {
        const success = resp?.success;
        const message = resp?.message || 'Internamiento registrado correctamente';

        this.snackBar.open(message, '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: [success ? 'success-snackbar' : 'error-snackbar']
        });

        if (success) this.dialogRef.close(true);
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Error al registrar internamiento', '', {
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
