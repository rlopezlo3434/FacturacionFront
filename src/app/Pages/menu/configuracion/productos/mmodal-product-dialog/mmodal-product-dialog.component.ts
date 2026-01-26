import { Component, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CatalogosService } from '../../../../../../services/catalogos.service';
import { ProductosService } from '../../../../../../services/productos.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-mmodal-product-dialog',
  templateUrl: './mmodal-product-dialog.component.html',
  styleUrl: './mmodal-product-dialog.component.scss'
})
export class MmodalProductDialogComponent {
 product: any = {
    name: '',
    quantity: 0,
    price: 0,
    serialCode: '',
    brandId: null,
    isMultiBrand: false
  };

  brands: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<MmodalProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private productService: ProductosService,
    private brandService: CatalogosService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadBrands();

    if (this.data) {
      this.product = {
        name: this.data.name,
        quantity: this.data.quantity,
        price: this.data.price,
        serialCode: this.data.serialCode,
        isMultiBrand: this.data.isMultiBrand,
        brandId: this.data.brand?.id ?? null
      };
    }
  }

  loadBrands() {
    this.brandService.getBrands().subscribe((res: any) => {
      this.brands = res?.data || res || [];
    });
  }

  onMultiBrandChange() {
    if (this.product.isMultiBrand) {
      this.product.brandId = null; // ✅ si es multi marca, no requiere marca
    }
  }

  guardar() {
    const payload = {
      name: this.product.name,
      quantity: Number(this.product.quantity),
      price: Number(this.product.price),
      serialCode: this.product.serialCode || null,
      isMultiBrand: this.product.isMultiBrand,
      brandId: this.product.isMultiBrand ? null : this.product.brandId
    };

    const accion = this.data
      ? this.productService.updateProduct(this.data.id, payload)
      : this.productService.createProduct(payload);

    const mensaje = this.data ? 'Producto actualizado' : 'Producto creado';

    accion.subscribe({
      next: (resp: any) => {
        this.snackBar.open(resp?.message || mensaje, '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });

        this.dialogRef.close(true);
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Error', '', {
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
