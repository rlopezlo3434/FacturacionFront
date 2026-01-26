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

  }

  getInitials(text: string) {
    return (text || '').substring(0, 2).toUpperCase();
  }

}
