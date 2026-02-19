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

  userRole: string = '';
  constructor(private sidebarService: SidebarService, private router: Router) { }

  ALL_MENU_ITEMS: MenuItem[] = [
    {
      label: 'Facturación',
      name: 'facturacion',
      icon: 'receipt_long',
      children: [
        { label: 'Generar Venta', route: '/facturacion/venta' },
        { label: 'Caja', route: '/facturacion/caja' }
      ],
    },
    {
      label: 'Configuración',
      name: 'configuracion',
      icon: 'settings',
      children: [
        { label: 'Gestion de Cliente', route: '/configuracion/Clientes' },
        { label: 'Gestion de Productos/Servicios', route: '/configuracion/Items' },
        { label: 'Gestion de Empleados', route: '/configuracion/Empleados' },
        { label: 'Gestion de Descuentos', route: '/configuracion/Descuentos' },
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
    {
      label: 'Dashboard',
      name: 'dashboard',
      icon: 'dashboard',
      children: [
        { label: 'Resumen', route: '/dashboard/resumen' },
        { label: 'General', route: '/dashboard/general' }
      ],
    },
  ];

  ngOnInit() {

    this.sidebarService.toggleSidenav$.subscribe(() => {
      this.sidenav.toggle();
    });


    const userStr = localStorage.getItem('user');

    if (userStr) {
      const user = JSON.parse(userStr);
      console.log('Username:', user.username);
      this.userRole = user.username; // Assuming the user object has a 'role' property
    }


    this.loadMenuByRole();

  }
  loadMenuByRole() {

    if (this.userRole === 'administradora.general') {

      // 🔐 SOLO DASHBOARD SIN "General"
      this.menuItems = this.ALL_MENU_ITEMS
        .filter(item => item.name === 'dashboard')
        .map(item => ({
          ...item,
          children: item.children?.filter(
            child => child.label == 'General'
          )
        }));
       console.log('Menu para administradora.general:', this.menuItems);
    } else {

      // 👤 OTROS ROLES → TODO MENOS "Dashboard > General"
      this.menuItems = this.ALL_MENU_ITEMS.map(item => {
        if (item.name === 'dashboard') {
          return {
            ...item,
            children: item.children?.filter(
              child => child.route !== '/dashboard/general'
            )
          };
        }
        return item;
      });

    }
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
