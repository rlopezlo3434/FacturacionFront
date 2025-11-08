import { Component } from '@angular/core';
import { KardexService } from '../../../../../services/kardex.service';
import { MatDialog } from '@angular/material/dialog';
import { KardexModalComponent } from './kardex-modal/kardex-modal.component';

@Component({
  selector: 'app-kardex',
  templateUrl: './kardex.component.html',
  styleUrl: './kardex.component.scss'
})
export class KardexComponent {
  products: any[] = [];
  movimientos: any[] = [];
  productoSeleccionado: any = null;

  ngOnInit() {
    this.loadProducts();
  }

  constructor(private kardexService: KardexService, private dialog: MatDialog) { }

  loadProducts() {
    this.kardexService.getProducts().subscribe(
      (data: any[]) => {
        this.products = data;
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  viewMovements(item: any) {
    this.productoSeleccionado = item;
    console.log('Producto seleccionado:', this.productoSeleccionado);
    this.kardexService.getProductMovements(this.productoSeleccionado.itemId).subscribe(
      {
        next: (res: any) => {
          if (res.success) {
            this.movimientos = res.data;
          } else {
            this.movimientos = [];
          }
        },
        error: (err) => console.error('Error al obtener movimientos', err)
      }
    );
  }

  agregarMovimiento() {
    const dialogRef = this.dialog.open(KardexModalComponent, {
      width: '400px',
      data: { itemId: this.productoSeleccionado.itemId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.kardexService.agregarMovimiento(result).subscribe({
          next: (res: any) => {
            alert(res.message || 'Movimiento agregado correctamente');
            this.viewMovements(this.productoSeleccionado);
          },
          error: (err) => {
            alert(err.error?.message || 'Error al agregar el movimiento');
          }
        });
      }
    });
  }
}
