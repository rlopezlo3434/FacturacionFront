import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnInit,
  ViewChild
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../../../../environments/environment';
import { ClienteService } from '../../../../../../services/cliente.service';
import { VehicleIntakeService } from '../../../../../../services/vehicle-intake.service';
import { VehiculoService } from '../../../../../../services/vehiculo.service';

@Component({
  selector: 'app-modal-intake-dialog',
  templateUrl: './modal-intake-dialog.component.html',
  styleUrl: './modal-intake-dialog.component.scss'
})
export class ModalIntakeDialogComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas1') canvas1!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvas2') canvas2!: ElementRef<HTMLCanvasElement>;

  contexts: Record<number, CanvasRenderingContext2D> = {};
  drawing: Record<number, boolean> = {};
  lastPos: Record<number, { x: number; y: number }> = {};

  intake: any = {
    id: null,
    vehicleId: null,
    clientId: null,
    mode: 1,
    pickupAddress: '',
    mileageKm: null,
    services: '',
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
  existingImages: any[] = [];

  apiBaseUrl = 'http://161.132.56.183:8023';
  readonly assetBaseUrl = this.apiBaseUrl;
  baseImageUrl = `${this.apiBaseUrl}/Intakes/base/AUTO1.png`;
  baseImageUrl2 = `${this.apiBaseUrl}/Intakes/base/AUTO2.png`;

  isLoadingDetail = false;
  private viewInitialized = false;
  private pendingInventoryItems: any[] = [];
  private pendingDiagramUrls: Partial<Record<number, string>> = {};

  get isEditMode(): boolean {
    return !!this.data?.id;
  }

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

    if (this.isEditMode) {
      this.loadIntakeDetailForEdit(this.data.id);
      return;
    }

    if (this.data?.vehicleId) {
      this.intake.vehicleId = this.data.vehicleId;
    }

    if (this.data?.clientId) {
      this.intake.clientId = this.data.clientId;
    }
  }

  ngAfterViewInit(): void {
    this.viewInitialized = true;

    if (!this.isEditMode && this.canvas1 && this.canvas2) {
      this.initCanvas(this.canvas1.nativeElement, 1);
      this.initCanvas(this.canvas2.nativeElement, 2);
    }

    this.tryApplyPendingDiagrams();
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
    if (!this.drawing[key]) {
      return;
    }

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

  clearCanvas(key: number) {
    const canvas = this.getCanvas(key);
    const ctx = this.contexts[key];

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    delete this.pendingDiagramUrls[key];
  }

  getCanvas(key: number): HTMLCanvasElement {
    return key === 1 ? this.canvas1.nativeElement : this.canvas2.nativeElement;
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
    if (!input.files) {
      return;
    }

    Array.from(input.files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        return;
      }

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
    this.vehicleSearch = this.formatVehicleLabel(v);

    if (v.owner?.id) {
      this.intake.clientId = v.owner.id;
    }

    this.showVehicleDropdown = false;
  }

  loadVehicles() {
    this.vehiculoService.getVehicles().subscribe((res: any) => {
      this.vehicles = res?.data || [];
      this.syncVehicleSearch();
      this.filterVehiclesNative();
    });
  }

  loadClients() {
    this.clienteService.getClientesByEstablishment().subscribe((res: any) => {
      this.clients = res?.data || res || [];
    });
  }

  loadInventoryMaster() {
    this.intakeService.getInventoryMaster().subscribe((res: any) => {
      this.inventoryMaster = (res?.data || []).map((item: any) => ({
        ...item,
        isPresent: false
      }));

      this.inventoryVehiculo = this.inventoryMaster.filter(x => x.group === 1);
      this.inventoryAccesorios = this.inventoryMaster.filter(x => x.group === 2);

      if (this.pendingInventoryItems.length > 0) {
        this.applyInventorySelection(this.pendingInventoryItems);
        this.pendingInventoryItems = [];
      }
    });
  }

  loadIntakeDetailForEdit(id: number) {
    this.isLoadingDetail = true;

    this.intakeService.getIntakeDetail(id).subscribe({
      next: (res: any) => {
        const detail = res?.data || res;
        this.populateForm(detail);
        this.isLoadingDetail = false;
      },
      error: (err) => {
        this.isLoadingDetail = false;
        this.snackBar.open(
          err?.error?.message || 'No se pudo cargar el internamiento para editar',
          '',
          {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          }
        );
        this.dialogRef.close(false);
      }
    });
  }

  populateForm(detail: any) {
    this.intake = {
      id: detail?.id ?? this.data?.id ?? null,
      vehicleId: detail?.vehicle?.id ?? detail?.vehicleId ?? null,
      clientId: detail?.client?.id ?? detail?.clientId ?? null,
      mode: detail?.mode ?? 1,
      pickupAddress: detail?.pickupAddress || '',
      mileageKm: detail?.mileageKm ?? null,
      services: detail?.services || '',
      observations: detail?.observations || '',
      inventoryItems: detail?.inventoryItems || []
    };

    this.pendingInventoryItems = detail?.inventoryItems || [];
    if (this.inventoryMaster.length > 0) {
      this.applyInventorySelection(this.pendingInventoryItems);
      this.pendingInventoryItems = [];
    }

    this.existingImages = detail?.images || [];

    this.prepareExistingDiagrams(detail?.imagesDiagram || []);
    this.syncVehicleSearch();
  }

  prepareExistingDiagrams(diagrams: any[]) {
    this.pendingDiagramUrls = {};

    diagrams.forEach((diagram: any) => {
      const url = this.normalizeAssetUrl(diagram?.markedImageUrl);

      if (diagram?.markedImageUrl?.includes('diagram-1.png')) {
        this.pendingDiagramUrls[1] = url;
      }

      if (diagram?.markedImageUrl?.includes('diagram-2.png')) {
        this.pendingDiagramUrls[2] = url;
      }
    });

    this.tryApplyPendingDiagrams();
  }

  tryApplyPendingDiagrams() {
    if (!this.viewInitialized || this.isEditMode) {
      return;
    }

    [1, 2].forEach(key => {
      const url = this.pendingDiagramUrls[key];
      if (url) {
        this.loadDiagramIntoCanvas(key, url);
      }
    });
  }

  loadDiagramIntoCanvas(key: number, url: string) {
    const canvas = this.getCanvas(key);
    const ctx = this.contexts[key];
    const image = new Image();

    image.crossOrigin = 'anonymous';
    image.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    };
    image.src = url;
  }

  getDiagramUrl(key: number): string | null {
    return this.pendingDiagramUrls[key] || null;
  }

  applyInventorySelection(items: any[]) {
    if (!items?.length) {
      return;
    }

    this.inventoryMaster.forEach(masterItem => {
      const selected = items.find((item: any) =>
        item.inventoryMasterItemId === masterItem.id ||
        item.id === masterItem.id
      );

      masterItem.isPresent = selected?.isPresent ?? false;
    });
  }

  syncVehicleSearch() {
    if (!this.intake.vehicleId || this.vehicles.length === 0) {
      return;
    }

    const selectedVehicle = this.vehicles.find(v => v.id === this.intake.vehicleId);
    if (selectedVehicle) {
      this.vehicleSearch = this.formatVehicleLabel(selectedVehicle);
    }
  }

  formatVehicleLabel(vehicle: any): string {
    const plate = vehicle?.plate || '';
    const model = vehicle?.model?.name || '';
    const brand = vehicle?.brand?.name || '';

    if (!model && !brand) {
      return plate;
    }

    return `${plate} - ${model} (${brand})`;
  }

  normalizeAssetUrl(path: string): string {
    if (!path) {
      return '';
    }

    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }

    return `${this.assetBaseUrl}${path.startsWith('/') ? path : `/${path}`}`;
  }

  setInventory(masterId: number, value: boolean) {
    const item = this.inventoryMaster.find(x => x.id === masterId);
    if (item) {
      item.isPresent = value;
    }
  }

  async guardar() {
    const diagram1 = !this.isEditMode && this.canvas1
      ? await this.canvasToFile(this.getCanvas(1), 'diagram-1.png')
      : null;
    const diagram2 = !this.isEditMode && this.canvas2
      ? await this.canvasToFile(this.getCanvas(2), 'diagram-2.png')
      : null;

    const formData = this.buildFormData(diagram1, diagram2);
    const accion = this.isEditMode
      ? this.intakeService.updateIntake(this.intake.id || this.data.id, formData)
      : this.intakeService.createIntake(formData);

    const mensajeExito = this.isEditMode
      ? 'Internamiento actualizado correctamente'
      : 'Internamiento registrado correctamente';

    const mensajeError = this.isEditMode
      ? 'Error al actualizar internamiento'
      : 'Error al registrar internamiento';

    accion.subscribe({
      next: (resp: any) => {
        const success = resp?.success;
        const message = resp?.message || mensajeExito;

        this.snackBar.open(message, '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: [success ? 'success-snackbar' : 'error-snackbar']
        });

        if (success) {
          this.dialogRef.close(true);
        }
      },
      error: (err) => {
        this.snackBar.open(err?.error?.message || mensajeError, '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  buildFormData(diagram1: File | null, diagram2: File | null): FormData {
    const formData = new FormData();

    formData.append('vehicleId', String(this.intake.vehicleId));
    formData.append('clientId', String(this.intake.clientId));
    formData.append('mode', String(this.intake.mode));
    formData.append('mileageKm', String(Number(this.intake.mileageKm)));
    if (diagram1) {
      formData.append('diagrams', diagram1);
    }

    if (diagram2) {
      formData.append('diagrams', diagram2);
    }
    formData.append('services', (this.intake.services || '').toUpperCase());

    if (this.intake.mode === 2) {
      formData.append('pickupAddress', this.intake.pickupAddress || '');
    }

    if (this.intake.observations) {
      formData.append('observations', this.intake.observations.toUpperCase());
    }

    const inventoryItems = this.inventoryMaster.map(x => ({
      inventoryMasterItemId: x.id,
      isPresent: x.isPresent
    }));

    formData.append('inventoryItems', JSON.stringify(inventoryItems));

    this.selectedImages.forEach(file => {
      formData.append('images', file);
    });

    return formData;
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
