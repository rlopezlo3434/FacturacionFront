import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { WorkOrderService } from '../../../../../../services/work-order.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-modal-work-order-detail-dialog',
  templateUrl: './modal-work-order-detail-dialog.component.html',
  styleUrl: './modal-work-order-detail-dialog.component.scss'
})
export class ModalWorkOrderDetailDialogComponent {
workOrder: any = null;
  items: any[] = [];
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<ModalWorkOrderDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private workOrderService: WorkOrderService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadDetail();
  }

  loadDetail() {
    this.workOrderService.getWorkOrderDetail(this.data.workOrderId).subscribe({
      next: (res: any) => {
        this.workOrder = res?.data;
        this.items = this.workOrder?.items || [];
      },
      error: () => {
        this.snackBar.open('No se pudo cargar el detalle de la Orden de Trabajo', '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  guardarAvance() {
    if (!this.workOrder?.id) return;

    const payload = {
      workOrderId: this.workOrder.id,
      items: this.items.map(x => ({
        id: x.id,
        isCompleted: x.isCompleted,
        observations: x.observations || null
      }))
    };

    this.loading = true;

    this.workOrderService.updateItemStatus(payload).subscribe({
      next: (res: any) => {
        this.loading = false;

        this.snackBar.open(res?.message || 'Avance guardado', '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });

        this.dialogRef.close(true); // ✅ refresca lista general
      },
      error: (err) => {
        this.loading = false;

        this.snackBar.open(err.error?.message || 'Error al guardar avance', '', {
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
