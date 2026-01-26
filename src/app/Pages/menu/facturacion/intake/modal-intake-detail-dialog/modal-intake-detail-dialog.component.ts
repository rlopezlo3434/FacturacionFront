import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { VehicleIntakeService } from '../../../../../../services/vehicle-intake.service';

@Component({
  selector: 'app-modal-intake-detail-dialog',
  templateUrl: './modal-intake-detail-dialog.component.html',
  styleUrl: './modal-intake-detail-dialog.component.scss'
})
export class ModalIntakeDetailDialogComponent {
 intake: any = null;
  intakeDetails: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<ModalIntakeDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private intakeService: VehicleIntakeService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadDetail();
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

  goToBudget() {
    this.dialogRef.close();
    this.router.navigate(['/presupuestos', this.intake.id]); // ✅ tu ruta real
  }

  cancelar() {
    this.dialogRef.close(false);
  }
}
