import { Component, ViewChild } from '@angular/core';
import { SidebarService } from '../../../services/sidebar.service';
import { MatSidenav } from '@angular/material/sidenav';
import { MenuItem } from '../../Models/MenuItem';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  usuariosOpen = false;
  menuItems: MenuItem[] = [];
  constructor(private sidebarService: SidebarService) { }

  ngOnInit() {
    this.sidebarService.toggleSidenav$.subscribe(() => {
      this.sidenav.toggle();
    });


    this.menuItems = [
      {
        label: 'Facturas',
        name: 'usuarios',
        icon: 'file_copy',
        children: [{ label: 'Lista de Facturas', route: '/home/facturas' }],
      },
      {
        label: 'Configuración',
        name: 'configuracion',
        icon: 'settings',
        children: [
          { label: 'Gestion de Cliente', route: '/configuracion/Clientes' },
          { label: 'Gestion de Items', route: '/configuracion/Items' },
          { label: 'Gestion de Empleados', route: '/configuracion/Empleados' },
          { label: 'Gestion de Promociones', route: '/configuracion/Promociones' }],
      },

    ];

    console.log(this.menuItems)
  }

  toggleUsuarios() {
    this.usuariosOpen = !this.usuariosOpen;
  }

  toggleMenu(item: MenuItem) {
    item.open = !item.open;
  }
}
