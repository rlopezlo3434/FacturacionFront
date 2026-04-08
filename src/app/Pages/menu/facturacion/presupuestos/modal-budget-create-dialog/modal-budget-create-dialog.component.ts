import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BudgetService } from '../../../../../../services/budget.service';
import { ProductosService } from '../../../../../../services/productos.service';
import { ServicesServiceService } from '../../../../../../services/services-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PaqueteServicioService } from '../../../../../../services/paquete-servicio.service';

@Component({
  selector: 'app-modal-budget-create-dialog',
  templateUrl: './modal-budget-create-dialog.component.html',
  styleUrl: './modal-budget-create-dialog.component.scss'
})
export class ModalBudgetCreateDialogComponent {
  // ✅ Maestros
  products: any[] = [];
  services: any[] = [];

  // ✅ Search
  searchProduct = '';
  searchService = '';

  filteredProducts: any[] = [];
  filteredServices: any[] = [];
  searchPackage = '';

  packages: any[] = [];
  filteredPackages: any[] = [];
  // ✅ Items del presupuesto
  items: any[] = [];
  packageGroupCounter = 0;

  total = 0;
  notes: string = '';
  extras: string = '';
  constructor(
    public dialogRef: MatDialogRef<ModalBudgetCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private budgetService: BudgetService,
    private productService: ProductosService,
    private servicesMasterService: ServicesServiceService,
    private servicePackageService: PaqueteServicioService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadMasters();
    this.loadPackages();
  }

  loadPackages() {

    this.servicePackageService.getAll().subscribe((res: any) => {
      this.packages = res ?? [];
      console.log(this.packages)
    });
  }

  filterPackages() {
    console.log('Filtering packages with:', this.packages);
    const text = this.searchPackage.toLowerCase();

    this.filteredPackages = this.packages.filter(p =>
      p.description.toLowerCase().includes(text)
    );

  }

  addPackage(pkg: any) {
    const groupId = `package-${++this.packageGroupCounter}`;

    this.items.push({
      isPackageHeader: true,
      packageGroupId: groupId,
      packageDescription: pkg.description,
      packageItemsCount: pkg.items.length
    });

    pkg.items.forEach((item: any) => {

      if (item.itemType === 'Product' || item.itemType === 1) {

        const prod = this.products.find(x => x.id === item.productId);

        if (!prod) return;

        this.items.push({
          isPackageChild: true,
          packageGroupId: groupId,
          itemType: 1,
          name: prod.name,
          productId: prod.id,
          serialCode: prod.serialCode,
          quantity: item.quantity,
          unitPrice: prod.price,
          discount: 0,
          totalPrice: prod.price * item.quantity,
          servicePackageId: pkg.id
        });

      }

      if (item.itemType === 'Service' || item.itemType === 2) {

        const serv = this.services.find(x => x.id === item.serviceMasterId);

        if (!serv) return;

        this.items.push({
          isPackageChild: true,
          packageGroupId: groupId,
          itemType: 2,
          name: serv.name,
          serviceMasterId: serv.id,
          quantity: item.quantity,
          unitPrice: serv.price,
          discount: 0,
          totalPrice: serv.price * item.quantity,
          servicePackageId: pkg.id
        });

      }

    });

    this.searchPackage = '';
    this.filteredPackages = [];

    this.calcTotals();
  }

  loadMasters() {
    // ✅ productos
    this.productService.getProducts().subscribe((res: any) => {
      this.products = res?.data || [];
    });

    // ✅ servicios
    this.servicesMasterService.getServices().subscribe((res: any) => {
      this.services = res?.data || [];
    });
  }

  // ✅ Filtro productos
  filterProducts() {
    const t = (this.searchProduct || '').trim().toLowerCase();
    if (!t) {
      this.filteredProducts = [];
      return;
    }

    this.filteredProducts = this.products
      .filter(x =>
        (x.code || '').toLowerCase().includes(t) ||
        (x.name || '').toLowerCase().includes(t) ||
        (x.serialCode || '').toLowerCase().includes(t)
      )
      .slice(0, 8);
  }

  // ✅ Filtro servicios
  filterServices() {
    const t = (this.searchService || '').trim().toLowerCase();
    if (!t) {
      this.filteredServices = [];
      return;
    }

    this.filteredServices = this.services
      .filter(x =>
        (x.code || '').toLowerCase().includes(t) ||
        (x.name || '').toLowerCase().includes(t)
      )
      .slice(0, 8);
  }

  // ✅ Agregar producto al detalle
  addProduct(p: any) {
    this.items.push({
      itemType: 1,
      productId: p.id,
      serviceMasterId: null,
      serialCode: p.serialCode,
      name: `${p.code} - ${p.name}`,
      quantity: 1,
      unitPrice: Number(p.price || 0),
      discount: 0,
      totalPrice: Number(p.price || 0)
    });

    this.searchProduct = '';
    this.filteredProducts = [];
    this.calcTotals();
  }

  // ✅ Agregar servicio al detalle
  addService(s: any) {
    this.items.push({
      itemType: 2,
      productId: null,
      serviceMasterId: s.id,
      serialCode: null,
      name: `${s.code} - ${s.name}`,
      quantity: 1,
      unitPrice: Number(s.price || 0),
      totalPrice: Number(s.price || 0),
      discount: Number(s.discount || 0),
    });

    this.searchService = '';
    this.filteredServices = [];
    this.calcTotals();
  }

  removeItem(index: number) {
    const item = this.items[index];

    if (item?.isPackageHeader) {
      this.items = this.items.filter(x => x.packageGroupId !== item.packageGroupId);
      this.calcTotals();
      return;
    }

    this.items.splice(index, 1);

    if (item?.packageGroupId) {
      const hasChildren = this.items.some(x => x.packageGroupId === item.packageGroupId && x.isPackageChild);

      if (!hasChildren) {
        this.items = this.items.filter(x => x.packageGroupId !== item.packageGroupId);
      }
    }

    this.calcTotals();
  }

  // ✅ Calcular totales
  calcTotals() {
    this.total = 0;

    for (const it of this.items) {
      if (it.isPackageHeader) continue;

      const qty = Number(it.quantity || 0);
      const price = Number(it.unitPrice || 0);
      const discount = Number(it.discount || 0);

      const gross = qty * price;

      // 🛑 seguridad: descuento no mayor al total bruto
      const appliedDiscount = discount > gross ? gross : discount;

      it.discount = appliedDiscount;
      it.totalPrice = gross - appliedDiscount;

      this.total += it.totalPrice;
    }
  }

  // ✅ Guardar
  guardar() {
    console.log(this.items);
    const payload = {
      vehicleIntakeId: this.data.intakeId,
      notes: this.notes || null,
      extras: this.extras || null,
      items: this.items.filter(x => !x.isPackageHeader).map(x => ({
        itemType: x.itemType,
        productId: x.productId,
        serviceMasterId: x.serviceMasterId,
        quantity: Number(x.quantity),
        unitPrice: Number(x.unitPrice),
        discount: x.discount,
        servicePackageId: x.servicePackageId || null
      }))
    };

    // console.log(payload);
    this.budgetService.createBudget(payload).subscribe({
      next: (resp: any) => {
        this.snackBar.open(resp?.message || 'Presupuesto creado correctamente', '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
        this.notes = '';
        this.extras = '';

        this.dialogRef.close(true);
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Error al crear presupuesto', '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });

        this.notes = '';
        this.extras = '';

      }
    });
  }

  cancelar() {
    this.dialogRef.close(false);
  }
}
