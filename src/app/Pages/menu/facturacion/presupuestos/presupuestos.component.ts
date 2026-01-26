import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BudgetService } from '../../../../../services/budget.service';
import { ModalBudgetCreateDialogComponent } from './modal-budget-create-dialog/modal-budget-create-dialog.component';
import { ModalBudgetDetailDialogComponent } from './modal-budget-detail-dialog/modal-budget-detail-dialog.component';
import { WorkOrderService } from '../../../../../services/work-order.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-presupuestos',
  templateUrl: './presupuestos.component.html',
  styleUrl: './presupuestos.component.scss'
})
export class PresupuestosComponent {
  intakeId!: number;
  budgets: any[] = [];

  filtroTexto = '';

  paginaActual = 1;
  filasPorPagina = 10;

  constructor(
    private route: ActivatedRoute,
    private budgetService: BudgetService,
    private dialog: MatDialog,
    private workOrderService: WorkOrderService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.intakeId = Number(this.route.snapshot.paramMap.get('intakeId'));
    this.loadBudgets();
  }

  openMenu() { }

  loadBudgets() {
    this.budgetService.getBudgetsByIntake(this.intakeId).subscribe((res: any) => {
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
    const dialogRef = this.dialog.open(ModalBudgetCreateDialogComponent, {
      width: '1500px',
      maxWidth: '80vw',
      disableClose: true,
      data: { intakeId: this.intakeId }
    });

    dialogRef.afterClosed().subscribe(ok => {
      if (ok) this.loadBudgets();
    });
  }

  openBudgetDetail(budget: any) {
    const dialogRef = this.dialog.open(ModalBudgetDetailDialogComponent, {
      width: '1500px',
      maxWidth: '80vw',
      disableClose: true,
      data: { budgetId: budget.id, intakeId: this.intakeId }
    });

    dialogRef.afterClosed().subscribe(ok => {
      if (ok) this.loadBudgets();
    });
  }

  paginaAnterior() {
    if (this.paginaActual > 1) this.paginaActual--;
  }

  paginaSiguiente() {
    const totalPages = Math.ceil(this.budgets.length / this.filasPorPagina);
    if (this.paginaActual < totalPages) this.paginaActual++;
  }

  hasOfficialApprovedBudget(): boolean {
    return this.budgets.some(x => x.isOfficial && x.isApproved);
  }

  generateWorkOrder() {
    this.workOrderService.createFromIntake(this.intakeId).subscribe({
      next: (res: any) => {
        this.snackBar.open(res?.message || 'Orden de Trabajo creada', '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });

        // ✅ acá ya puedes navegar a pantalla OT
        this.router.navigate(['facturacion/orden-trabajo/intake']);
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Error', '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}
