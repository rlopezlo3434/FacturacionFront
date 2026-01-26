import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BudgetService } from '../../../../../../services/budget.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-modal-budget-detail-dialog',
  templateUrl: './modal-budget-detail-dialog.component.html',
  styleUrl: './modal-budget-detail-dialog.component.scss'
})
export class ModalBudgetDetailDialogComponent {
  budget: any = null;
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<ModalBudgetDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private budgetService: BudgetService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadDetail();
  }

  loadDetail() {
    this.loading = true;

    this.budgetService.getBudgetDetail(this.data.budgetId).subscribe({
      next: (res: any) => {
        this.budget = res?.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('No se pudo cargar el detalle del presupuesto', '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  aprobar() {
    if (!this.budget?.id) return;

    this.budgetService.approveBudget(this.budget.id).subscribe({
      next: (res: any) => {
        this.snackBar.open(res?.message || 'Presupuesto aprobado', '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });

        this.dialogRef.close(true); // ✅ refresca la pantalla de presupuestos
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Error al aprobar presupuesto', '', {
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
