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

  recalcItem(it: any) {
    const qty = Number(it.quantity || 0);
    const price = Number(it.unitPrice || 0);
    const discount = Number(it.discount || 0);

    const gross = qty * price;

    if (discount > gross) {
      it.discount = gross;
    }

    it.totalPrice = gross - it.discount;

    this.recalcTotal();
  }

  recalcTotal() {
    this.budget.total = this.budget.items
      .filter((i: any) => i.isApproved)
      .reduce(((sum: any, i: any) => sum + i.totalPrice), 0);
  }

  toggleApprove(it: any) {
    if (!it.isApproved) {
      // opcional: resetear descuento si desmarcan
      // it.discount = 0;
    }

    this.recalcTotal();
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

  // aprobar() {
  //   if (!this.budget?.id) return;

  //   this.budgetService.approveBudget(this.budget.id).subscribe({
  //     next: (res: any) => {
  //       this.snackBar.open(res?.message || 'Presupuesto aprobado', '', {
  //         duration: 3000,
  //         horizontalPosition: 'right',
  //         verticalPosition: 'top',
  //         panelClass: ['success-snackbar']
  //       });

  //       this.dialogRef.close(true); // ✅ refresca la pantalla de presupuestos
  //     },
  //     error: (err) => {
  //       this.snackBar.open(err.error?.message || 'Error al aprobar presupuesto', '', {
  //         duration: 3000,
  //         horizontalPosition: 'right',
  //         verticalPosition: 'top',
  //         panelClass: ['error-snackbar']
  //       });
  //     }
  //   });
  // }

  aprobar() {
    const payload = {
      budgetId: this.budget.id,
      items: this.budget.items.map((it: any) => ({
        itemid: it.id,
        isApproved: it.isApproved,
        quantity: it.quantity,
        unitPrice: it.unitPrice,
        discount: it.discount,
        totalPrice: it.totalPrice
      }))
    };

    this.budgetService.saveItemApprovals(payload).subscribe({
      next: () => {
        this.snackBar.open('Aprobaciones guardadas correctamente', '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
        this.dialogRef.close(true);
      },
      error: () => {
        this.snackBar.open('Error al guardar aprobaciones', '', {
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
