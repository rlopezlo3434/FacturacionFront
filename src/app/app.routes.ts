import { Routes } from '@angular/router';
import { HomeComponent } from './Pages/home/home.component';
import { LoginComponent } from './Pages/login/login.component';
import { UsuariosComponent } from './Pages/menu/usuarios/usuarios.component';
import { LayoutComponent } from './Components/layout/layout.component';
import { ItemsComponent } from './Pages/menu/configuracion/items/items.component';
import { PromocionesComponent } from './Pages/menu/configuracion/promociones/promociones.component';
import { EmpleadosComponent } from './Pages/menu/configuracion/empleados/empleados.component';
import { ClientesComponent } from './Pages/menu/configuracion/clientes/clientes.component';
import { FacturacionComponent } from './Pages/menu/facturacion/facturacion.component';
import { KardexComponent } from './Pages/menu/configuracion/kardex/kardex.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'home',
    component: LayoutComponent,
    children: [
      { path: 'facturas', component: UsuariosComponent },

    ],
  },
  {
    path: 'facturacion',
    component: LayoutComponent,
    children: [
      { path: 'venta', component: FacturacionComponent },
    ]
  },
  {
    path: 'configuracion',
    component: LayoutComponent,
    children: [
      { path: 'Items', component: ItemsComponent },
      { path: 'Descuentos', component: PromocionesComponent },
      { path: 'Empleados', component: EmpleadosComponent },
      { path: 'Clientes', component: ClientesComponent },
      { path: 'Almacen', component: KardexComponent },
    ]
  }
];
