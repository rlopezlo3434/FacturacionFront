import { Component } from '@angular/core';
import { WorkOrderService } from '../../../../../services/work-order.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalWorkOrderDetailDialogComponent } from './modal-work-order-detail-dialog/modal-work-order-detail-dialog.component';

@Component({
  selector: 'app-ordenes-trabajo',
  templateUrl: './ordenes-trabajo.component.html',
  styleUrl: './ordenes-trabajo.component.scss'
})
export class OrdenesTrabajoComponent {
  workOrders: any[] = [];
  filtroTexto = '';

  paginaActual = 1;
  filasPorPagina = 10;

  constructor(
    private workOrderService: WorkOrderService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadWorkOrders();
  }

  openMenu() { }

  reload() {
    this.loadWorkOrders();
  }

  loadWorkOrders() {
    this.workOrderService.getWorkOrders().subscribe((res: any) => {
      this.workOrders = res?.data || res || [];
    });
  }

  openDetail(ot: any) {
    const dialogRef = this.dialog.open(ModalWorkOrderDetailDialogComponent, {
      width: '1500px',
      maxWidth: '80vw',
      disableClose: true,
      data: { workOrderId: ot.id }
    });

    dialogRef.afterClosed().subscribe(ok => {
      if (ok) this.loadWorkOrders();
    });
  }

  getInitials(text: string): string {
    if (!text) return '—';
    return text.substring(0, 2).toUpperCase();
  }

  countPending(): number {
    return this.workOrders.filter(x => !x.isCompleted).length;
  }

  countCompleted(): number {
    return this.workOrders.filter(x => x.isCompleted).length;
  }

  paginaAnterior() {
    if (this.paginaActual > 1) this.paginaActual--;
  }

  paginaSiguiente() {
    const totalPages = Math.ceil(this.workOrders.length / this.filasPorPagina);
    if (this.paginaActual < totalPages) this.paginaActual++;
  }
}
