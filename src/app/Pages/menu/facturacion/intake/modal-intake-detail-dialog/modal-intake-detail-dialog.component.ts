import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { VehicleIntakeService } from '../../../../../../services/vehicle-intake.service';
import { environment } from '../../../../../../environments/environment';
@Component({
  selector: 'app-modal-intake-detail-dialog',
  templateUrl: './modal-intake-detail-dialog.component.html',
  styleUrl: './modal-intake-detail-dialog.component.scss'
})
export class ModalIntakeDetailDialogComponent {
  intake: any = null;
  intakeDetails: any[] = [];

  apiBaseUrl = 'http://161.132.56.183:8023/';
  environment = 'http://161.132.56.183/'

  baseImageUrl1 = this.apiBaseUrl + '/Intakes/base/AUTO1.png';
  baseImageUrl2 = this.apiBaseUrl + '/Intakes/base/AUTO2.png';

  galleryOpen = false;
  currentImageIndex = 0;

  constructor(
    public dialogRef: MatDialogRef<ModalIntakeDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private intakeService: VehicleIntakeService,
    private router: Router,
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.loadDetail();
  }


  getDiagram(key: number) {
    return this.intake?.imagesDiagram?.find(
      (d: any) => d.markedImageUrl.includes(`diagram-${key}.png`)
    );
  }

  loadDetail() {
    // ✅ Este endpoint debe devolverte intake + details
    // Ej: GET api/VehicleIntake/{id}
    this.intakeService.getIntakeDetail(this.data.intakeId).subscribe({
      next: (res: any) => {
        this.intake = res?.data || res;
        this.intakeDetails = this.intake?.inventoryItems || [];
      },
      error: () => {
        this.snackBar.open('No se pudo cargar el detalle del internamiento', '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  openGallery(index: number) {
    this.currentImageIndex = index;
    this.galleryOpen = true;
  }

  closeGallery() {
    this.galleryOpen = false;
  }

  prevImage(event: Event) {
    event.stopPropagation();
    const total = this.intake?.images?.length || 0;
    this.currentImageIndex = (this.currentImageIndex - 1 + total) % total;
  }

  nextImage(event: Event) {
    event.stopPropagation();
    const total = this.intake?.images?.length || 0;
    this.currentImageIndex = (this.currentImageIndex + 1) % total;
  }

  downloadImage(img: any) {
    const url = this.apiBaseUrl + img.imageUrl;
    const fileName = img.imageUrl.split('/').pop() || 'imagen.jpg';

    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const objectUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = objectUrl;
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(objectUrl);
      },
      error: () => {
        this.snackBar.open('No se pudo descargar la imagen', '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  goToBudget() {
    this.dialogRef.close();
    this.router.navigate(['facturacion/presupuestos/intake/', this.intake.id]); // ✅ tu ruta real
  }

  cancelar() {
    this.dialogRef.close(false);
  }
}
