import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PaqueteServicioService } from '../../../../../../services/paquete-servicio.service';
import { ProductosService } from '../../../../../../services/productos.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServicesServiceService } from '../../../../../../services/services-service.service';

@Component({
  selector: 'app-modal-service-package-dialog',
  templateUrl: './modal-service-package-dialog.component.html',
  styleUrl: './modal-service-package-dialog.component.scss'
})
export class ModalServicePackageDialogComponent {
 paquete: any = {
    name: '',
    description: '',
    items: []
  };

  productos: any[] = [];
  servicios: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<ModalServicePackageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private packageService: PaqueteServicioService,
    private productService: ProductosService,
    private serviceMasterService: ServicesServiceService,
    private snackBar: MatSnackBar
  ) {}  

  ngOnInit(): void {

    this.loadProductos();
    this.loadServicios();

    if (this.data) {
      this.paquete = JSON.parse(JSON.stringify(this.data));
      console.log('Paquete cargado para edición:', this.paquete);
      this.paquete = {
      ...this.data,
      items: this.data.items.map((x: any) => ({
        ...x,
        itemType: x.itemType === 'Product' ? 1 : 2,
        searchText: '',
        showOptions: false
      }))
    };
    }
  }

  loadProductos() {
    this.productService.getProducts().subscribe(res => {
      this.productos = res.data;
      this.syncItemSearchText();
      console.log('Productos cargados:', this.productos);
    });
  }

  loadServicios() {
    this.serviceMasterService.getServices().subscribe(res => {
      this.servicios = res.data ;
      this.syncItemSearchText();
      console.log('Servicios cargados:', this.servicios);
    });
  }

  addItem() {
    this.paquete.items.push({
      itemType: 1,
      productId: null,
      serviceMasterId: null,
      quantity: 1,
      searchText: '',
      showOptions: false
    });
  }

  removeItem(index: number) {
    this.paquete.items.splice(index, 1);
  }

  onChangeItemType(index: number) {
    console.log('Tipo de item cambiado:', this.paquete.items[index].itemType);
    const item = this.paquete.items[index];

    item.productId = null;
    item.serviceMasterId = null;
    item.searchText = '';
    item.showOptions = false;
  }

  getFilteredProductos(index: number) {
    const filtro = this.paquete.items[index]?.searchText?.trim().toLowerCase();

    if (!filtro) {
      return this.productos;
    }

    return this.productos.filter((producto: any) =>
      (producto?.name || '').toLowerCase().includes(filtro)
    );
  }

  getFilteredServicios(index: number) {
    const filtro = this.paquete.items[index]?.searchText?.trim().toLowerCase();

    if (!filtro) {
      return this.servicios;
    }

    return this.servicios.filter((servicio: any) =>
      (servicio?.name || '').toLowerCase().includes(filtro)
    );
  }

  syncItemSearchText() {
    this.paquete.items = this.paquete.items.map((item: any) => {
      const producto = this.productos.find((x: any) => x.id === item.productId);
      const servicio = this.servicios.find((x: any) => x.id === item.serviceMasterId);

      return {
        ...item,
        searchText: item.searchText || producto?.name || servicio?.name || '',
        showOptions: false
      };
    });
  }

  showOptions(index: number) {
    this.paquete.items[index].showOptions = true;
  }

  hideOptions(index: number) {
    setTimeout(() => {
      if (this.paquete.items[index]) {
        this.paquete.items[index].showOptions = false;
      }
    }, 150);
  }

  selectProducto(index: number, producto: any) {
    this.paquete.items[index].productId = producto.id;
    this.paquete.items[index].searchText = producto.name;
    this.paquete.items[index].showOptions = false;
  }

  selectServicio(index: number, servicio: any) {
    this.paquete.items[index].serviceMasterId = servicio.id;
    this.paquete.items[index].searchText = servicio.name;
    this.paquete.items[index].showOptions = false;
  }

  guardar() {

    if (this.data) {

      this.packageService.update(this.data.id, this.paquete)
      .subscribe({
        next: () => {

          this.snackBar.open('Paquete actualizado', '', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });

          this.dialogRef.close(true);

        }
      });

    } else {

      this.packageService.create(this.paquete)
      .subscribe({
        next: () => {

          this.snackBar.open('Paquete creado', '', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });

          this.dialogRef.close(true);

        }
      });

    }

  }

  cancelar() {
    this.dialogRef.close();
  }

}
