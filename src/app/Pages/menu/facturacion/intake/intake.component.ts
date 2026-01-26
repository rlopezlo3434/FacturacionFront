import { Component, OnInit } from '@angular/core';
import { ModalIntakeDialogComponent } from './modal-intake-dialog/modal-intake-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { VehicleIntakeService } from '../../../../../services/vehicle-intake.service';
import { SidebarService } from '../../../../../services/sidebar.service';
import { Router } from '@angular/router';
import { ModalIntakeDetailDialogComponent } from './modal-intake-detail-dialog/modal-intake-detail-dialog.component';

@Component({
  selector: 'app-intake',
  templateUrl: './intake.component.html',
  styleUrl: './intake.component.scss'
})
export class IntakeComponent implements OnInit {

  selectedVehicle: any = {
    vehicleId: null,
    clientId: null,
    mode: 1, // 1 taller, 2 domicilio
    pickupAddress: '',
    mileageKm: null,
    observations: '',
    inventoryItems: []
  };

  filtroTexto = '';
  internamientos: any[] = [];

  paginaActual = 1;
  filasPorPagina = 10;

  constructor(private intakeService: VehicleIntakeService, private dialog: MatDialog, private sidebarService: SidebarService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadIntakes();
  }

  loadIntakes() {
    this.intakeService.getIntakes().subscribe((res: any) => {
      this.internamientos = res?.data || [];
    });
  }
  openMenu() {
    this.sidebarService.toggleSidenav();
  }

  openViewIntakeDialog(intake: any) { }
  openEditIntakeDialog(intake: any) { }
  confirmDeleteIntake(intake: any) { }

  openCreateIntakeDialog() {
    const dialogRef = this.dialog.open(ModalIntakeDialogComponent, {
      width: '850px',
      disableClose: true,
      data: {
        // vehicleId: vehicle?.id,
        // clientId: vehicle?.owner?.id
      }
    });

    dialogRef.afterClosed().subscribe(ok => {
      if (ok) this.loadIntakes();
    });
  }

  openDetail(intake: any) {
    this.dialog.open(ModalIntakeDetailDialogComponent, {
      width: '1500px',
      maxWidth: '80vw',
      disableClose: true,
      data: { intakeId: intake.id }
    });
  }

  paginaAnterior() {
    if (this.paginaActual > 1) this.paginaActual--;
  }

  paginaSiguiente() {
    const totalPages = Math.ceil(this.internamientos.length / this.filasPorPagina);
    if (this.paginaActual < totalPages) this.paginaActual++;
  }

  getInitials(text: string): string {
    if (!text) return '';
    return text.substring(0, 2).toUpperCase();
  }

  countMode(mode: number): number {
    return this.internamientos.filter(x => x.mode === mode).length;
  }

  goToBudgets(intake: any) {
    this.router.navigate(['facturacion/presupuestos/intake', intake.id]);
  }

}
