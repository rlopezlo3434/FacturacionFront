import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BudgetService } from '../../../../../../services/budget.service';
import { ProductosService } from '../../../../../../services/productos.service';
import { ServicesServiceService } from '../../../../../../services/services-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PaqueteServicioService } from '../../../../../../services/paquete-servicio.service';

@Component({
  selector: 'app-modal-budget-edit-dialog',
  templateUrl: './modal-budget-edit-dialog.component.html',
  styleUrl: './modal-budget-edit-dialog.component.scss'
})
export class ModalBudgetEditDialogComponent implements OnInit {
  products: any[] = [];
  services: any[] = [];

  searchProduct = '';
  searchService = '';

  filteredProducts: any[] = [];
  filteredServices: any[] = [];
  searchPackage = '';

  packages: any[] = [];
  filteredPackages: any[] = [];

  items: any[] = [];
  packageGroupCounter = 0;

  total = 0;
  notes: string = '';
  extras: string = '';
  moneda: 'PEN' | 'USD' = 'PEN';

  loading = true;

  constructor(
    public dialogRef: MatDialogRef<ModalBudgetEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private budgetService: BudgetService,
    private productService: ProductosService,
    private servicesMasterService: ServicesServiceService,
    private servicePackageService: PaqueteServicioService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadMasters();
    this.loadPackages();
    this.loadBudgetDetail();
  }

  loadBudgetDetail() {
    this.budgetService.getBudgetDetail(this.data.budgetId).subscribe({
      next: (res: any) => {
        const detail = res?.data || res;
        this.notes = detail?.notes || '';
        this.extras = detail?.extras || '';
        this.moneda = (detail?.moneda === 'USD' ? 'USD' : 'PEN') as 'PEN' | 'USD';

        this.items = (detail?.items || []).map((it: any) => ({
          itemType: it.itemType,
          productId: it.productId ?? it.product?.id ?? null,
          serviceMasterId: it.serviceMasterId ?? it.service?.id ?? null,
          serialCode: it.serialCode ?? it.product?.serialCode ?? null,
          name: it.product?.name || it.service?.name || it.name || it.description || '',
          quantity: it.quantity,
          unitPrice: Number(it.unitPrice || 0),
          discount: Number(it.discount || 0),
          totalPrice: Number(it.totalPrice || 0),
          servicePackageId: it.servicePackageId ?? null,
          isPackageChild: !!it.servicePackageId,
          isDiscount: !!(it.service?.isDiscount ?? it.isDiscount ?? (it.totalPrice < 0))
        }));

        this.loading = false;
        this.calcTotals();
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('No se pudo cargar el presupuesto', '', {
          duration: 3000, panelClass: ['error-snackbar']
        });
        this.dialogRef.close(false);
      }
    });
  }

  loadPackages() {
    this.servicePackageService.getAll().subscribe((res: any) => {
      this.packages = res ?? [];
    });
  }

  filterPackages() {
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
    this.productService.getProducts().subscribe((res: any) => {
      this.products = res?.data || [];
    });
    this.servicesMasterService.getServices().subscribe((res: any) => {
      this.services = res?.data || [];
    });
  }

  filterProducts() {
    const t = (this.searchProduct || '').trim().toLowerCase();
    if (!t) { this.filteredProducts = []; return; }
    this.filteredProducts = this.products
      .filter(x =>
        (x.code || '').toLowerCase().includes(t) ||
        (x.name || '').toLowerCase().includes(t) ||
        (x.serialCode || '').toLowerCase().includes(t)
      ).slice(0, 8);
  }

  filterServices() {
    const t = (this.searchService || '').trim().toLowerCase();
    if (!t) { this.filteredServices = []; return; }
    this.filteredServices = this.services
      .filter(x =>
        (x.code || '').toLowerCase().includes(t) ||
        (x.name || '').toLowerCase().includes(t)
      ).slice(0, 8);
  }

  get esDolar(): boolean { return this.moneda === 'USD'; }

  getProductPrice(p: any): number {
    return Number(this.esDolar ? (p.priceDolar ?? p.price ?? 0) : (p.price ?? 0));
  }

  getServicePrice(s: any): number {
    return Number(this.esDolar ? (s.priceDolar ?? s.price ?? 0) : (s.price ?? 0));
  }

  onMonedaChange() {
    this.items.forEach(it => {
      if (it.isPackageHeader || !it._sourceData) return;
      const src = it._sourceData;
      if (it.isDiscount) {
        const base = it.itemType === 1 ? this.getProductPrice(src) : this.getServicePrice(src);
        it.unitPrice = -Math.abs(base);
      } else {
        it.unitPrice = it.itemType === 1 ? this.getProductPrice(src) : this.getServicePrice(src);
      }
    });
    this.calcTotals();
  }

  addProduct(p: any) {
    const price = this.getProductPrice(p);
    this.items.push({
      itemType: 1,
      productId: p.id,
      serviceMasterId: null,
      serialCode: p.serialCode,
      name: `${p.code} - ${p.name}`,
      quantity: 1,
      unitPrice: price,
      discount: 0,
      totalPrice: price,
      _sourceData: p
    });
    this.searchProduct = '';
    this.filteredProducts = [];
    this.calcTotals();
  }

  addService(s: any) {
    const basePrice = this.getServicePrice(s);
    const price = s.isDiscount ? -Math.abs(basePrice) : basePrice;
    this.items.push({
      itemType: 2,
      productId: null,
      serviceMasterId: s.id,
      serialCode: null,
      name: `${s.code} - ${s.name}`,
      quantity: 1,
      unitPrice: price,
      totalPrice: price,
      discount: 0,
      isDiscount: !!s.isDiscount,
      _sourceData: s
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

  calcTotals() {
    this.total = 0;
    for (const it of this.items) {
      if (it.isPackageHeader) continue;
      const qty = Number(it.quantity || 0);
      const price = Number(it.unitPrice || 0);

      if (it.isDiscount) {
        it.totalPrice = qty * -Math.abs(price);
        it.unitPrice = -Math.abs(price);
      } else {
        const discount = Number(it.discount || 0);
        const gross = qty * price;
        const appliedDiscount = discount > gross ? gross : discount;
        it.discount = appliedDiscount;
        it.totalPrice = gross - appliedDiscount;
      }

      this.total += it.totalPrice;
    }
  }

  guardar() {
    const payload = {
      notes: this.notes || null,
      extras: this.extras || null,
      moneda: this.moneda,
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

    this.budgetService.updateBudget(this.data.budgetId, payload).subscribe({
      next: (resp: any) => {
        this.snackBar.open(resp?.message || 'Presupuesto actualizado correctamente', '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.snackBar.open(err?.error?.message || 'Error al actualizar presupuesto', '', {
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
