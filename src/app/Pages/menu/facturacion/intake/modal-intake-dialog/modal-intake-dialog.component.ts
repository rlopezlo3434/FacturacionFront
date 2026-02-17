import { AfterViewInit, Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VehiculoService } from '../../../../../../services/vehiculo.service';
import { ClienteService } from '../../../../../../services/cliente.service';
import { VehicleIntakeService } from '../../../../../../services/vehicle-intake.service';
import { HostListener } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
@Component({
  selector: 'app-modal-intake-dialog',
  templateUrl: './modal-intake-dialog.component.html',
  styleUrl: './modal-intake-dialog.component.scss'
})


export class ModalIntakeDialogComponent implements AfterViewInit {
  @ViewChild('canvas1') canvas1!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvas2') canvas2!: ElementRef<HTMLCanvasElement>;

  contexts: Record<number, CanvasRenderingContext2D> = {};
  drawing: Record<number, boolean> = {};
  lastPos: Record<number, { x: number; y: number }> = {};

  intake: any = {
    vehicleId: null,
    clientId: null,
    mode: 1,
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

  selectedImages: File[] = [];
  imagePreviews: string[] = [];

  baseImageUrl = 'http://161.132.56.183:8023/Intakes/base/AUTO1.png';
  baseImageUrl2 = 'http://161.132.56.183:8023/Intakes/base/AUTO2.png';


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

    if (this.data?.vehicleId) {
      this.intake.vehicleId = this.data.vehicleId;
    }

    if (this.data?.clientId) {
      this.intake.clientId = this.data.clientId;
    }
  }

  ngAfterViewInit() {


    this.initCanvas(this.canvas1.nativeElement, 1);
    this.initCanvas(this.canvas2.nativeElement, 2);
  }

  initCanvas(canvas: HTMLCanvasElement, key: number) {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const ctx = canvas.getContext('2d')!;
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';

    this.contexts[key] = ctx;
  }

  getPos(event: any, canvas: HTMLCanvasElement) {
    const rect = canvas.getBoundingClientRect();

    if (event.touches) {
      return {
        x: event.touches[0].clientX - rect.left,
        y: event.touches[0].clientY - rect.top
      };
    }

    return {
      x: event.offsetX,
      y: event.offsetY
    };
  }

  startDraw(event: any, key: number) {
    event.preventDefault();

    const canvas = this.getCanvas(key);
    const pos = this.getPos(event, canvas);

    this.drawing[key] = true;
    this.lastPos[key] = pos;
  }

  draw(event: any, key: number) {
    if (!this.drawing[key]) return;

    const canvas = this.getCanvas(key);
    const pos = this.getPos(event, canvas);
    const ctx = this.contexts[key];

    ctx.beginPath();
    ctx.moveTo(this.lastPos[key].x, this.lastPos[key].y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    this.lastPos[key] = pos;
  }

  stopDraw(key: number) {
    this.drawing[key] = false;
  }

  getCanvas(key: number): HTMLCanvasElement {
    return key === 1
      ? this.canvas1.nativeElement
      : this.canvas2.nativeElement;
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: any) {
    const target = event.target as HTMLElement;

    if (!target.closest('.combo-box')) {
      this.showVehicleDropdown = false;
    }
  }

  onImagesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    Array.from(input.files).forEach(file => {

      if (!file.type.startsWith('image/')) return;

      this.selectedImages.push(file);

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviews.push(reader.result as string);
      };
      reader.readAsDataURL(file);
    });

    input.value = '';
  }

  removeImage(index: number) {
    this.selectedImages.splice(index, 1);
    this.imagePreviews.splice(index, 1);
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

    this.vehicleSearch = `${v.plate} - ${v.model?.name} (${v.brand?.name})`;

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

      this.inventoryMaster.forEach(x => x.isPresent = false);

      this.inventoryVehiculo = this.inventoryMaster.filter(x => x.group === 1);
      this.inventoryAccesorios = this.inventoryMaster.filter(x => x.group === 2);
    });
  }

  setInventory(masterId: number, value: boolean) {
    const item = this.inventoryMaster.find(x => x.id === masterId);
    if (item) item.isPresent = value;
  }

  // guardar() {
  //   const payload = {
  //     vehicleId: this.intake.vehicleId,
  //     clientId: this.intake.clientId,
  //     mode: this.intake.mode,
  //     pickupAddress: this.intake.mode === 2 ? this.intake.pickupAddress : null,
  //     mileageKm: Number(this.intake.mileageKm),
  //     observations: this.intake.observations,
  //     inventoryItems: this.inventoryMaster.map(x => ({
  //       inventoryMasterItemId: x.id,
  //       isPresent: x.isPresent
  //     }))
  //   };

  //   this.intakeService.createIntake(payload).subscribe({
  //     next: (resp: any) => {
  //       const success = resp?.success;
  //       const message = resp?.message || 'Internamiento registrado correctamente';

  //       this.snackBar.open(message, '', {
  //         duration: 3000,
  //         horizontalPosition: 'right',
  //         verticalPosition: 'top',
  //         panelClass: [success ? 'success-snackbar' : 'error-snackbar']
  //       });

  //       if (success) this.dialogRef.close(true);
  //     },
  //     error: (err) => {
  //       this.snackBar.open(err.error?.message || 'Error al registrar internamiento', '', {
  //         duration: 3000,
  //         horizontalPosition: 'right',
  //         verticalPosition: 'top',
  //         panelClass: ['error-snackbar']
  //       });
  //     }
  //   });
  // }

  async guardar() {

    const diagram1 = await this.canvasToFile(
      this.getCanvas(1),
      'diagram-1.png'
    );

    const diagram2 = await this.canvasToFile(
      this.getCanvas(2),
      'diagram-2.png'
    );

    const formData = new FormData();

    // 🔹 Datos principales
    formData.append('vehicleId', String(this.intake.vehicleId));
    formData.append('clientId', String(this.intake.clientId));
    formData.append('mode', String(this.intake.mode));
    formData.append('mileageKm', String(Number(this.intake.mileageKm)));
    formData.append('diagrams', diagram1);
    formData.append('diagrams', diagram2);

    if (this.intake.mode === 2) {
      formData.append('pickupAddress', this.intake.pickupAddress);
    }

    if (this.intake.observations) {
      formData.append('observations', this.intake.observations);
    }

    // 🔹 Inventario (convertido a JSON string)
    const inventoryItems = this.inventoryMaster.map(x => ({
      inventoryMasterItemId: x.id,
      isPresent: x.isPresent
    }));

    formData.append('inventoryItems', JSON.stringify(inventoryItems));

    // 🔹 Imágenes
    this.selectedImages.forEach((file) => {
      formData.append('images', file);
    });

    // 🔹 Envío
    this.intakeService.createIntake(formData).subscribe({
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
        this.snackBar.open(
          err.error?.message || 'Error al registrar internamiento',
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

  canvasToFile(canvas: HTMLCanvasElement, name: string): Promise<File> {
    return new Promise(resolve => {
      canvas.toBlob(blob => {
        resolve(new File([blob!], name, { type: 'image/png' }));
      }, 'image/png');
    });
  }

  cancelar() {
    this.dialogRef.close(false);
  }
}
