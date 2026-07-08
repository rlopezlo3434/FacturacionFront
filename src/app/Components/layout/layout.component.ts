import { Component, ViewChild, HostListener, ElementRef } from '@angular/core';
import { SidebarService } from '../../../services/sidebar.service';
import { MatSidenav } from '@angular/material/sidenav';
import { MenuItem } from '../../Models/MenuItem';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  collapsed = false;
  popoverItem: MenuItem | null = null;
  popoverTop = 0;

  menuItems: MenuItem[] = [];

  constructor(
    private sidebarService: SidebarService,
    private router: Router,
    private el: ElementRef
  ) {}

  ngOnInit() {
    this.sidebarService.toggleSidenav$.subscribe(() => {
      this.collapsed = !this.collapsed;
      this.popoverItem = null;
    });

    this.menuItems = [
      {
        label: 'Facturación',
        name: 'facturacion',
        icon: 'receipt_long',
        children: [
          { label: 'Internamiento Vehículos', route: '/facturacion/intake' },
          { label: 'Ordenes de Trabajo', route: '/facturacion/orden-trabajo/intake' },
          { label: 'Facturación', route: '/facturacion/venta' },
          { label: 'Facturas', route: '/facturacion/Facturas' },
        ],
      },
      {
        label: 'Configuración',
        name: 'configuracion',
        icon: 'settings',
        children: [
          { label: 'Clientes', route: '/configuracion/Clientes' },
          { label: 'Proveedores', route: '/configuracion/Proveedores' },
          { label: 'Paquetes', route: '/configuracion/PaqueteServicio' },
          { label: 'Marcas / Modelos', route: '/configuracion/Marcas' },
          { label: 'Vehículos', route: '/configuracion/Vehiculos' },
          { label: 'Servicios', route: '/configuracion/Servicios' },
          { label: 'Productos', route: '/configuracion/Productos' },
          { label: 'Gestion de Empleados', route: '/configuracion/Empleados' },
        ],
      },
      {
        label: 'Compras',
        name: 'compras',
        icon: 'shopping_cart',
        children: [
          { label: 'Listado de Compras', route: '/compras/listado' }
        ],
      },
      {
        label: 'Almacén',
        name: 'almacen',
        icon: 'house_siding',
        children: [
          { label: 'Kardex', route: '/configuracion/Almacen' }
        ],
      },
    ];
  }

  toggleCollapse() {
    this.collapsed = !this.collapsed;
    this.popoverItem = null;
  }

  toggleMenu(item: MenuItem) {
    if (this.collapsed) return;
    item.open = !item.open;
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
    this.popoverItem = null;
  }

  onItemClick(item: MenuItem, event: MouseEvent) {
    if (this.collapsed) {
      if (this.popoverItem === item) {
        this.popoverItem = null;
        return;
      }
      const target = event.currentTarget as HTMLElement;
      this.popoverTop = target.getBoundingClientRect().top;
      this.popoverItem = item;
    } else {
      if (item.route) {
        this.navigateTo(item.route);
      } else {
        item.open = !item.open;
      }
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.popoverItem = null;
    }
  }

  closePopover() {
    this.popoverItem = null;
  }
}
