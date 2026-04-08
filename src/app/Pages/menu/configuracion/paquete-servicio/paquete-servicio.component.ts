import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PaqueteServicioService } from '../../../../../services/paquete-servicio.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SidebarService } from '../../../../../services/sidebar.service';
import { ModalServicePackageDialogComponent } from './modal-service-package-dialog/modal-service-package-dialog.component';

@Component({
  selector: 'app-paquete-servicio',
  templateUrl: './paquete-servicio.component.html',
  styleUrl: './paquete-servicio.component.scss'
})
export class PaqueteServicioComponent {
 paquetes: any[] = [];
  filtroTexto: string = '';

  paginaActual = 1;
  filasPorPagina = 50;

  roleCode: string | null = null;

  totalActivos = 0;
  totalProductos = 0;
  totalServicios = 0;

  constructor(
    private dialog: MatDialog,
    private servicePackageService: PaqueteServicioService,
    private snackBar: MatSnackBar,
    private sidebarService: SidebarService
  ) {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    this.roleCode = user?.roleCode;
  }

  ngOnInit(): void {
    this.loadPaquetes();
  }

  loadPaquetes() {
    this.servicePackageService.getAll().subscribe({
      next: (data: any[]) => {
        this.paquetes = data || [];
        this.calcularResumen();
      },
      error: () => {
        this.snackBar.open('Error al cargar paquetes de servicio', '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  calcularResumen() {
    this.totalActivos = this.paquetes.filter(x => x.isActive).length;

    this.totalProductos = this.paquetes.reduce((acc, paquete) => {
      return acc + this.getCantidadProductos(paquete.items);
    }, 0);

    this.totalServicios = this.paquetes.reduce((acc, paquete) => {
      return acc + this.getCantidadServicios(paquete.items);
    }, 0);
  }

  getPaquetesFiltrados(): any[] {
    const texto = (this.filtroTexto || '').trim().toLowerCase();

    if (!texto) return this.paquetes;

    return this.paquetes.filter(x =>
      (x.code || '').toLowerCase().includes(texto) ||
      (x.name || '').toLowerCase().includes(texto) ||
      (x.description || '').toLowerCase().includes(texto)
    );
  }

  getPaquetesPaginados(): any[] {
    const inicio = (this.paginaActual - 1) * this.filasPorPagina;
    const fin = this.paginaActual * this.filasPorPagina;
    return this.getPaquetesFiltrados().slice(inicio, fin);
  }

  removerFiltros() {
    this.filtroTexto = '';
    this.paginaActual = 1;
  }

  paginaAnterior() {
    if (this.paginaActual > 1) {
      this.paginaActual--;
    }
  }

  paginaSiguiente() {
    if (this.paginaActual * this.filasPorPagina < this.getPaquetesFiltrados().length) {
      this.paginaActual++;
    }
  }

  getDesde(): number {
    const total = this.getPaquetesFiltrados().length;
    if (total === 0) return 0;
    return (this.paginaActual - 1) * this.filasPorPagina + 1;
  }

  getHasta(): number {
    const total = this.getPaquetesFiltrados().length;
    const hasta = this.paginaActual * this.filasPorPagina;
    return hasta > total ? total : hasta;
  }

  getPorcentajeActivos(): number {
    if (!this.paquetes.length) return 0;
    return Math.round((this.totalActivos / this.paquetes.length) * 100);
  }

  getCantidadProductos(items: any[]): number {
    if (!items || !items.length) return 0;
    return items.filter(x => x.itemType === "Product").length;
  }

  getCantidadServicios(items: any[]): number {
    if (!items || !items.length) return 0;
    return items.filter(x => x.itemType === "Service").length;
  }

  getInitials(fullName: string): string {
    if (!fullName) return '';

    const words = fullName
      .trim()
      .split(/\s+/)
      .filter(w => w.length > 0);

    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }

    return words[0].substring(0, 2).toUpperCase();
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(ModalServicePackageDialogComponent, {
      width: '1000px',
      maxWidth: '85vw',
      height: '50vh',
      panelClass: 'full-modal'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPaquetes();
      }
    });
  }

  openEditDialog(paquete: any) {
    const dialogRef = this.dialog.open(ModalServicePackageDialogComponent, {
      width: '1000px',
      maxWidth: '85vw',
      panelClass: 'full-modal',
      data: paquete
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPaquetes();
      }
    });
  }

  openMenu() {
    this.sidebarService.toggleSidenav();
  }
}
