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
import { CajaComponent } from './Pages/menu/facturacion/caja/caja.component';
import { VehiculosComponent } from './Pages/menu/configuracion/vehiculos/vehiculos.component';
import { ManoDeObraComponent } from './Pages/menu/configuracion/mano-de-obra/mano-de-obra.component';
import { MarcaComponent } from './Pages/menu/configuracion/marca/marca.component';
import { IntakeComponent } from './Pages/menu/facturacion/intake/intake.component';
import { ServiciosComponent } from './Pages/menu/configuracion/servicios/servicios.component';
import { ProductosComponent } from './Pages/menu/configuracion/productos/productos.component';
import { PresupuestosComponent } from './Pages/menu/facturacion/presupuestos/presupuestos.component';
import { OrdenesTrabajoComponent } from './Pages/menu/facturacion/ordenes-trabajo/ordenes-trabajo.component';
import { ProveedoresComponent } from './Pages/menu/configuracion/proveedores/proveedores.component';
import { ListarFacturacionComponent } from './Pages/menu/facturacion/listar-facturacion/listar-facturacion.component';
import { PaqueteServicioComponent } from './Pages/menu/configuracion/paquete-servicio/paquete-servicio.component';

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
      { path: 'intake', component: IntakeComponent },
      { path: 'Facturas', component: ListarFacturacionComponent },
      { path: 'venta', component: FacturacionComponent },
      { path: 'caja', component: CajaComponent },
      { path: 'presupuestos/intake/:intakeId', component: PresupuestosComponent },
      { path: 'orden-trabajo/intake', component: OrdenesTrabajoComponent }
    ]
  },
  {
    path: 'configuracion',
    component: LayoutComponent,
    children: [
      { path: 'Items', component: ItemsComponent },
      { path: 'Descuentos', component: PromocionesComponent },
      { path: 'PaqueteServicio', component: PaqueteServicioComponent},
      { path: 'Empleados', component: EmpleadosComponent },
      { path: 'Clientes', component: ClientesComponent },
      { path: 'Proveedores', component: ProveedoresComponent },
      { path: 'ManoDeObra', component: ManoDeObraComponent },
      { path: 'Vehiculos', component: VehiculosComponent },
      { path: 'Productos', component: ProductosComponent },
      { path: 'Servicios', component: ServiciosComponent },
      { path: 'Almacen', component: KardexComponent },
      { path: 'Marcas', component: MarcaComponent }
    ]
  }
];
