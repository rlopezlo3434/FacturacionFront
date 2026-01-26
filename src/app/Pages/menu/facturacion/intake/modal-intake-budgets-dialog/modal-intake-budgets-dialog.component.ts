import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BudgetService } from '../../../../../../services/budget.service';

@Component({
  selector: 'app-modal-intake-budgets-dialog',
  templateUrl: './modal-intake-budgets-dialog.component.html',
  styleUrl: './modal-intake-budgets-dialog.component.scss'
})
export class ModalIntakeBudgetsDialogComponent {
budgets: any[] = [];
  filtroTexto = '';

  constructor(
    public dialogRef: MatDialogRef<ModalIntakeBudgetsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private budgetService: BudgetService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadBudgets();
  }

  loadBudgets() {
    const intakeId = this.data?.intake?.id;
    this.budgetService.getBudgetsByIntake(intakeId).subscribe((res: any) => {
      this.budgets = res?.data || [];
    });
  }

  getOfficialCode(): string {
    const oficial = this.budgets.find(x => x.isOfficial);
    return oficial ? oficial.code : '—';
  }

  countPending(): number {
    return this.budgets.filter(x => !x.isApproved).length;
  }

  openCreateBudgetModal() {
    // const dialogRef = this.dialog.open(ModalBudgetCreateDialogComponent, {
    //   width: '900px',
    //   disableClose: true,
    //   data: {
    //     intakeId: this.data?.intake?.id
    //   }
    // });

    // dialogRef.afterClosed().subscribe(ok => {
    //   if (ok) this.loadBudgets();
    // });
  }

  openDetailBudget(budget: any) {
    // const dialogRef = this.dialog.open(ModalBudgetDetailDialogComponent, {
    //   width: '900px',
    //   disableClose: true,
    //   data: {
    //     budgetId: budget.id,
    //     intakeId: this.data?.intake?.id
    //   }
    // });

    // dialogRef.afterClosed().subscribe(ok => {
    //   if (ok) this.loadBudgets();
    // });
  }

  cancelar() {
    this.dialogRef.close();
  }
}
