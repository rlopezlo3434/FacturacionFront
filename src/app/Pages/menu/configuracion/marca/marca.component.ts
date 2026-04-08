import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ClienteService } from '../../../../../services/cliente.service';
import { SidebarService } from '../../../../../services/sidebar.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CatalogosService } from '../../../../../services/catalogos.service';
import { ModalBrandDialogComponent } from './modal-brand-dialog/modal-brand-dialog.component';
import { ModalModelDialogComponent } from './modal-model-dialog/modal-model-dialog.component';

@Component({
  selector: 'app-marca',
  templateUrl: './marca.component.html',
  styleUrl: './marca.component.scss'
})
export class MarcaComponent {
  brands: any[] = [];
  models: any[] = [];
  selectedBrand: any = null;

  filtroTexto = '';
  paginaActualMarcas = 1;
  filasPorPaginaMarcas = 10;

  totalModels = 0;
  constructor(private dialog: MatDialog, private clienteService: ClienteService,
    private snackBar: MatSnackBar, private sidebarService: SidebarService, private catalogService: CatalogosService) {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
  }

  ngOnInit() {
    this.loadBrands();
  }



  openMenu() {
    this.sidebarService.toggleSidenav();
  }

  loadBrands() {
    this.catalogService.getBrands().subscribe((res: any) => {
      this.brands = res.data;
      this.paginaActualMarcas = 1;
    });
  }

  selectBrand(brand: any) {
    this.selectedBrand = brand;
    this.loadModelsByBrand(brand.id);
  }

  loadModelsByBrand(brandId: number) {
    this.catalogService.getModelsByBrand(brandId).subscribe((res: any) => {
      this.models = res.data;
      this.totalModels = this.totalModels || this.models.length; // si solo quieres el de esta marca, borra esta línea
    });
  }

  openCreateBrandDialog() {
    const dialogRef = this.dialog.open(ModalBrandDialogComponent, {
      width: '1600px',
      panelClass: 'full-modal'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadBrands();
      }
    });
  }

  openCreateModelDialog() {
    if (!this.selectedBrand) return;

    const dialogRef = this.dialog.open(ModalModelDialogComponent, {
      width: '520px',
      disableClose: true,
      data: { brandId: this.selectedBrand.id } // ✅ marca preseleccionada
    });

    dialogRef.afterClosed().subscribe(ok => {
      if (ok) this.loadModelsByBrand(this.selectedBrand.id);
    });
  }

  
  openEditModelDialog(model: any) {
    const dialogRef = this.dialog.open(ModalModelDialogComponent, {
      width: '520px',
      disableClose: true,
      data: {
        id: model.id,
        brandId: model.brandId ?? this.selectedBrand?.id,
        name: model.name,
        isActive: model.isActive
      }
    });

    dialogRef.afterClosed().subscribe(ok => {
      if (ok && this.selectedBrand?.id) {
        this.loadModelsByBrand(this.selectedBrand.id);
      }
    });
  }

  getInitials(text: string) {
    return (text || '').substring(0, 2).toUpperCase();
  }

  updateBrandState(brand: any, isActive: boolean) {
    const payload = {
      name: brand.name,
      isActive
    };

    this.catalogService.updateBrandState(brand.id, payload).subscribe({
      next: (resp: any) => {
        const success = resp?.success;
        const message = resp?.message || 'Estado de la marca actualizado correctamente';

        this.snackBar.open(message, '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: [success ? 'success-snackbar' : 'error-snackbar']
        });

        if (success) {
          if (this.selectedBrand?.id === brand.id) {
            this.selectedBrand = { ...this.selectedBrand, isActive };
          }
          this.loadBrands();
        }
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Error al actualizar el estado de la marca', '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  updateModelState(model: any, isActive: boolean) {
    const payload = {
      isActive,
      brandId: model.brandId ?? this.selectedBrand?.id
    };

    this.catalogService.updateModelState(model.id, payload).subscribe({
      next: (resp: any) => {
        const success = resp?.success;
        const message = resp?.message || 'Estado del modelo actualizado correctamente';

        this.snackBar.open(message, '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: [success ? 'success-snackbar' : 'error-snackbar']
        });

        if (success && this.selectedBrand?.id) {
          this.models = this.models.map(current =>
            current.id === model.id ? { ...current, isActive } : current
          );
          this.loadModelsByBrand(this.selectedBrand.id);
        }
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Error al actualizar el estado del modelo', '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  get totalPaginasMarcas(): number {
    return Math.max(1, Math.ceil(this.marcasFiltradas.length / this.filasPorPaginaMarcas));
  }

  get marcasFiltradas(): any[] {
    const filtro = this.filtroTexto?.trim().toLowerCase();

    if (!filtro) {
      return this.brands;
    }

    return this.brands.filter(brand =>
      (brand?.name || '').toLowerCase().includes(filtro)
    );
  }

  get marcasPaginadas(): any[] {
    const inicio = (this.paginaActualMarcas - 1) * this.filasPorPaginaMarcas;
    return this.marcasFiltradas.slice(inicio, inicio + this.filasPorPaginaMarcas);
  }

  paginaAnteriorMarcas() {
    if (this.paginaActualMarcas > 1) {
      this.paginaActualMarcas--;
    }
  }

  paginaSiguienteMarcas() {
    if (this.paginaActualMarcas < this.totalPaginasMarcas) {
      this.paginaActualMarcas++;
    }
  }

}
