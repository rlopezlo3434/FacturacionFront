import { Component, OnInit } from '@angular/core';
import { ModalIntakeDialogComponent } from './modal-intake-dialog/modal-intake-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { VehicleIntakeService } from '../../../../../services/vehicle-intake.service';
import { SidebarService } from '../../../../../services/sidebar.service';
import { Router } from '@angular/router';
import { ModalIntakeDetailDialogComponent } from './modal-intake-detail-dialog/modal-intake-detail-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

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



  constructor(private intakeService: VehicleIntakeService, private dialog: MatDialog, private sidebarService: SidebarService, private snackBar: MatSnackBar,
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

  openEditIntakeDialog(intake: any) {
    const dialogRef = this.dialog.open(ModalIntakeDialogComponent, {
      width: '1500px',
      maxWidth: '80vw',
      disableClose: true,
      data: {
        id: intake.id
      }
    });

    dialogRef.afterClosed().subscribe(ok => {
      if (ok) {
        this.loadIntakes();
      }
    });
  }

  confirmDeleteIntake(intake: any) { }



  openCreateIntakeDialog() {
    const dialogRef = this.dialog.open(ModalIntakeDialogComponent, {
      width: '1500px',
      maxWidth: '80vw',
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


  obtenerPDFinternamiento(intake: any) {
    this.intakeService.getIntakePDF(intake.id).subscribe({
      next: (pdfData: Blob) => {
        const url = window.URL.createObjectURL(pdfData);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Internamiento_${intake.id}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'No se pudo descargar el PDF.', '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
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


  generarInternamiento() {
    console.log('Generar PDF del internamiento');
  }

  deleteIntake(i: any) {
    const confirmacion = confirm(`¿Eliminar internamiento N°${i.id}?`);
    if (!confirmacion) return;

    this.intakeService.deleteIntake(i.id).subscribe({
      next: (res: any) => {
        if (res.success) {
          alert(res.message);

          // 🔥 actualizar lista sin recargar
          this.internamientos = this.internamientos.filter(x => x.id !== i.id);
        } else {
          alert(res.message);
        }
      },
      error: (err) => {
        console.error(err);
        alert("Error al eliminar");
      }
    });
  }
}
