import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { WorkOrderService } from '../../../../../../services/work-order.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmpleadosService } from '../../../../../../services/empleados.service';
import { ProveedorService } from '../../../../../../services/proveedor.service';

@Component({
  selector: 'app-modal-work-order-detail-dialog',
  templateUrl: './modal-work-order-detail-dialog.component.html',
  styleUrl: './modal-work-order-detail-dialog.component.scss'
})
export class ModalWorkOrderDetailDialogComponent {
  workOrder: any = null;
  items: any[] = [];
  loading = false;
  empleados: any[] = [];
  proveedores: any[] = [];
  showEmpleados = false;
  showProveedores = false;

  selectedEmpleadoIds: number[] = [];
  selectedProveedorIds: number[] = [];
  constructor(
    public dialogRef: MatDialogRef<ModalWorkOrderDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private workOrderService: WorkOrderService,
    private snackBar: MatSnackBar,
    private empleadoService: EmpleadosService,
    private proveedorService: ProveedorService
  ) { }

  ngOnInit(): void {
    this.loadDetail();
    this.loadEmpleados();
    this.loadProveedores();
  }

  getEmpleadosSeleccionados() {
    return this.empleados.filter(x =>
      this.selectedEmpleadoIds.includes(x.id)
    );
  }

  getProveedoresSeleccionados() {
    return this.proveedores.filter(x =>
      this.selectedProveedorIds.includes(x.id)
    );
  }

  toggleDropdown(type: string) {

    if (type === 'empleados') {
      this.showEmpleados = !this.showEmpleados;
    }

    if (type === 'proveedores') {
      this.showProveedores = !this.showProveedores;
    }

  }

  toggleEmpleado(id: number) {

    const index = this.selectedEmpleadoIds.indexOf(id);

    if (index > -1) {
      this.selectedEmpleadoIds.splice(index, 1);
    } else {
      this.selectedEmpleadoIds.push(id);
    }

  }

  toggleProveedor(id: number) {

    const index = this.selectedProveedorIds.indexOf(id);

    if (index > -1) {
      this.selectedProveedorIds.splice(index, 1);
    } else {
      this.selectedProveedorIds.push(id);
    }

  }

  loadEmpleados() {
    this.empleadoService.getEmpleadosByEstablishment().subscribe({
      next: (res: any) => {
        console.log(res);
        this.empleados = res || [];
      },
      error: () => {
        this.snackBar.open('No se pudo cargar la lista de empleados', '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });

  }

  loadProveedores() {
    this.proveedorService.getProveedores().subscribe({
      next: (res: any) => {
        console.log(res);
        this.proveedores = res || [];
      },
      error: () => {
        this.snackBar.open('No se pudo cargar la lista de proveedores', '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  loadDetail() {
    this.workOrderService.getWorkOrderDetail(this.data.workOrderId).subscribe({
      next: (res: any) => {
        this.workOrder = res?.data;
        this.items = this.workOrder?.items || [];

        // 🔹 AUTOCOMPLETAR EMPLEADOS
        this.selectedEmpleadoIds = this.workOrder.employees?.map((x: any) => x.id) || [];

        // 🔹 AUTOCOMPLETAR PROVEEDORES
        this.selectedProveedorIds = this.workOrder.proveedores?.map((x: any) => x.id) || [];
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
      empleadosIds: this.selectedEmpleadoIds,
      proveedoresIds: this.selectedProveedorIds,
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
