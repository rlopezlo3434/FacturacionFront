import { Component } from '@angular/core';
import { ModalServiceMasterDialogComponent } from './modal-service-master-dialog/modal-service-master-dialog.component';
import { ServicesServiceService } from '../../../../../services/services-service.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrl: './servicios.component.scss'
})
export class ServiciosComponent {
filtroTexto = '';
  services: any[] = [];

  paginaActual = 1;
  filasPorPagina = 10;

  constructor(
    private servicesService: ServicesServiceService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadServices();
  }

  openMenu() {}

  loadServices() {
    this.servicesService.getServices().subscribe((res: any) => {
      this.services = res?.data || [];
    });
  }

   openCreateDialog() {
    const dialogRef = this.dialog.open(ModalServiceMasterDialogComponent, {
      width: '600px',
      disableClose: true,
      data: null
    });

    dialogRef.afterClosed().subscribe(ok => {
      if (ok) this.loadServices();
    });
  }

  openEditDialog(service: any) {
    const dialogRef = this.dialog.open(ModalServiceMasterDialogComponent, {
      width: '600px',
      disableClose: true,
      data: service
    });

    dialogRef.afterClosed().subscribe(ok => {
      if (ok) this.loadServices();
    });
  }

  paginaAnterior() {
    if (this.paginaActual > 1) this.paginaActual--;
  }

  paginaSiguiente() {
    const totalPages = Math.ceil(this.services.length / this.filasPorPagina);
    if (this.paginaActual < totalPages) this.paginaActual++;
  }

  countActivos(): number {
    return this.services.filter(x => x.isActive).length;
  }

  countInactivos(): number {
    return this.services.filter(x => !x.isActive).length;
  }
}
