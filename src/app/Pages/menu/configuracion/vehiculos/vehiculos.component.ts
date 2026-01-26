import { Component } from '@angular/core';
import { ModalHijosDialogComponent } from '../clientes/modal-hijos-dialog/modal-hijos-dialog.component';
import { ModalClientesDialogComponent } from '../clientes/modal-clientes-dialog/modal-clientes-dialog.component';
import { ModalNumbersDialogComponent } from '../clientes/modal-numbers-dialog/modal-numbers-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ClienteService } from '../../../../../services/cliente.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SidebarService } from '../../../../../services/sidebar.service';
import { ModalVehicleDialogComponent } from './modal-vehicle-dialog/modal-vehicle-dialog.component';
import { VehiculoService } from '../../../../../services/vehiculo.service';

@Component({
  selector: 'app-vehiculos',
  templateUrl: './vehiculos.component.html',
  styleUrl: './vehiculos.component.scss'
})
export class VehiculosComponent {

  vehiculos: any[] = [];
  filtroTexto: string = '';

  marcaMasFrecuente: string | null = null;

  paginaActual = 1;
  filasPorPagina = 50;

  roleCode: string | null = null;

  constructor(private sidebarService: SidebarService, private dialog: MatDialog,
    private vehiculoService: VehiculoService, private snackBar: MatSnackBar) {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    this.roleCode = user?.roleCode;
  }

  ngOnInit() {
    this.loadVehicles();
  }


  getActivosCount(): number {
    return this.vehiculos.filter(x => x.isActive).length;
  }

  getVehicleImage(v: any) {
    return 'https://hyundai.pe/wp-content/uploads/2024/02/New-TUCSON-carro-familia-viaje.webp';
  }

  onImgError(ev: any) {
    ev.target.src = 'assets/vehicle-default.jpg';
  }

  removerFiltros() {
    this.filtroTexto = '';
    this.paginaActual = 1;
  }

  paginaAnterior() {
    if (this.paginaActual > 1) this.paginaActual--;
  }


  openCreateDialog() {
    const dialogRef = this.dialog.open(ModalVehicleDialogComponent, {
      width: '1500px',
      panelClass: 'full-modal'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadVehicles();
      }
    });
  }

  loadVehicles() {
    this.vehiculoService.getVehicles().subscribe((res: any) => {
      this.vehiculos = res?.data || [];
    });
  }

  openMenu() {
    this.sidebarService.toggleSidenav();
  }

  openEditDialog(item: any) {
    const dialogRef = this.dialog.open(ModalVehicleDialogComponent, {
      width: '1500px',
      data: item
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadVehicles();
      }
    });
  }


}
