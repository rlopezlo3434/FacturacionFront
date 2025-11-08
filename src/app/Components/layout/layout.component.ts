import { Component, ViewChild } from '@angular/core';
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
  usuariosOpen = false;
  menuItems: MenuItem[] = [];
  constructor(private sidebarService: SidebarService, private router: Router) { }

  ngOnInit() {
    this.sidebarService.toggleSidenav$.subscribe(() => {
      this.sidenav.toggle();
    });


    this.menuItems = [
      // {
      //   label: 'Ventas',
      //   name: 'ventas',
      //   icon: 'file_copy',
      //   children: [{ label: 'Lista de Ventas', route: '/home/ventas' }],
      // },
      {
        label: 'Facturación',
        name: 'facturacion',
        icon: 'receipt_long',
        children: [{ label: 'Generar Venta', route: '/facturacion/venta' }],
      },
      {
        label: 'Configuración',
        name: 'configuracion',
        icon: 'settings',
        children: [
          { label: 'Gestion de Cliente', route: '/configuracion/Clientes' },
          { label: 'Gestion de Items', route: '/configuracion/Items' },
          { label: 'Gestion de Empleados', route: '/configuracion/Empleados' },
          { label: 'Gestion de Descuentos', route: '/configuracion/Descuentos' },
          // { label: 'Gestion de Almacén', route: '/configuracion/Almacen' }
        ],

      },
      {
        label: 'Alamacén',
        name: 'almacen',
        icon: 'house_siding',
        children: [
          { label: 'Kardex', route: '/configuracion/Almacen' }],

      },
    ];

  }

  toggleUsuarios() {
    this.usuariosOpen = !this.usuariosOpen;
  }

  toggleMenu(item: MenuItem) {
    item.open = !item.open;
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
