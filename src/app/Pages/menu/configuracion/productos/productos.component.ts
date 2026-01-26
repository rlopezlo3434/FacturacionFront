import { Component } from '@angular/core';
import { ProductosService } from '../../../../../services/productos.service';
import { MatDialog } from '@angular/material/dialog';
import { MmodalProductDialogComponent } from './mmodal-product-dialog/mmodal-product-dialog.component';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss'
})
export class ProductosComponent {

   filtroTexto = '';
  productos: any[] = [];

  paginaActual = 1;
  filasPorPagina = 10;

  lowStockLimit = 5;

  constructor(
    private productService: ProductosService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  openMenu() {}

  loadProducts() {
    this.productService.getProducts().subscribe((res: any) => {
      this.productos = res?.data || [];
    });
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(MmodalProductDialogComponent, {
      width: '700px',
      disableClose: true,
      data: null
    });

    dialogRef.afterClosed().subscribe(ok => {
      if (ok) this.loadProducts();
    });
  }

  openEditDialog(product: any) {
    const dialogRef = this.dialog.open(MmodalProductDialogComponent, {
      width: '700px',
      disableClose: true,
      data: product
    });

    dialogRef.afterClosed().subscribe(ok => {
      if (ok) this.loadProducts();
    });
  }

  paginaAnterior() {
    if (this.paginaActual > 1) this.paginaActual--;
  }

  paginaSiguiente() {
    const totalPages = Math.ceil(this.productos.length / this.filasPorPagina);
    if (this.paginaActual < totalPages) this.paginaActual++;
  }

  countLowStock(): number {
    return this.productos.filter(x => x.quantity <= this.lowStockLimit).length;
  }

  countMultiBrand(): number {
    return this.productos.filter(x => x.isMultiBrand).length;
  }
}
