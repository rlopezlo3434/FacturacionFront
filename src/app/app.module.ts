import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { HeaderComponent } from './Components/header/header.component';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './Pages/home/home.component';
import { LoginComponent } from './Pages/login/login.component';
import { Router, RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { LayoutComponent } from './Components/layout/layout.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { UsuariosComponent } from './Pages/menu/usuarios/usuarios.component';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ItemsComponent } from './Pages/menu/configuracion/items/items.component';
import { PromocionesComponent } from './Pages/menu/configuracion/promociones/promociones.component';
import { EmpleadosComponent } from './Pages/menu/configuracion/empleados/empleados.component';
import { ClientesComponent } from './Pages/menu/configuracion/clientes/clientes.component';
import { ModalItemDialogComponent } from './Pages/menu/configuracion/items/modal-item-dialog/modal-item-dialog.component';
import { ModalEmpleadoDialogComponent } from './Pages/menu/configuracion/empleados/modal-empleado-dialog/modal-empleado-dialog.component';
import { ModalClientesDialogComponent } from './Pages/menu/configuracion/clientes/modal-clientes-dialog/modal-clientes-dialog.component';
import { ModalPromocionesDialogComponent } from './Pages/menu/configuracion/promociones/modal-promociones-dialog/modal-promociones-dialog.component';
import { ItemsAdminComponent } from './Pages/menu/configuracion/items/items-admin/items-admin.component';
import {MatMenuModule} from '@angular/material/menu'
//pipes
import { FiltroEmpleadoPipe } from './pipes/filtro-empleado.pipe';
import { FiltroItemPipe } from './pipes/filtro-item.pipe';
import { FiltroClientePipe } from './pipes/filtro-cliente.pipe';
import { FiltroPromocioPipe } from './pipes/filtro-promocio.pipe';

import { ModalNumbersDialogComponent } from './Pages/menu/configuracion/clientes/modal-numbers-dialog/modal-numbers-dialog.component';
import { ModalHijosDialogComponent } from './Pages/menu/configuracion/clientes/modal-hijos-dialog/modal-hijos-dialog.component';
import { FacturacionComponent } from './Pages/menu/facturacion/facturacion.component';
import { KardexComponent } from './Pages/menu/configuracion/kardex/kardex.component';
import { KardexModalComponent } from './Pages/menu/configuracion/kardex/kardex-modal/kardex-modal.component';
import { SeleccionEmpleadosModalComponent } from './Pages/menu/facturacion/seleccion-empleados-modal/seleccion-empleados-modal.component';
import { CajaComponent } from './Pages/menu/facturacion/caja/caja.component';
import { VehiculosComponent } from './Pages/menu/configuracion/vehiculos/vehiculos.component';
import { ManoDeObraComponent } from './Pages/menu/configuracion/mano-de-obra/mano-de-obra.component';
import localeEsPe from '@angular/common/locales/es-PE';
import { registerLocaleData } from '@angular/common';
import { MarcaComponent } from './Pages/menu/configuracion/marca/marca.component';
import { ModalBrandDialogComponent } from './Pages/menu/configuracion/marca/modal-brand-dialog/modal-brand-dialog.component';
import { ModalModelDialogComponent } from './Pages/menu/configuracion/marca/modal-model-dialog/modal-model-dialog.component'
import { FiltroVehiculoPipe } from "./pipes/filtro-vehiculo.pipe";
import { ModalVehicleDialogComponent } from './Pages/menu/configuracion/vehiculos/modal-vehicle-dialog/modal-vehicle-dialog.component';
import { IntakeComponent } from './Pages/menu/facturacion/intake/intake.component';
import { ModalIntakeDialogComponent } from './Pages/menu/facturacion/intake/modal-intake-dialog/modal-intake-dialog.component';
import { IntakeFilterPipe } from "./pipes/intake-filter.pipe";
import { ServiciosComponent } from './Pages/menu/configuracion/servicios/servicios.component';
import { ModalServiceMasterDialogComponent } from './Pages/menu/configuracion/servicios/modal-service-master-dialog/modal-service-master-dialog.component';
import { ServiceFilterPipe } from './pipes/service-filter.pipe';
import { ProductosComponent } from './Pages/menu/configuracion/productos/productos.component';
import { MmodalProductDialogComponent } from './Pages/menu/configuracion/productos/mmodal-product-dialog/mmodal-product-dialog.component';
import { ProductFilterPipe } from "./pipes/product-filter.pipe";
import { ModalIntakeBudgetsDialogComponent } from './Pages/menu/facturacion/intake/modal-intake-budgets-dialog/modal-intake-budgets-dialog.component';
import { PresupuestosComponent } from './Pages/menu/facturacion/presupuestos/presupuestos.component';
import { BudgetFilterPipe } from "./pipes/budget-filter.pipe";
import { ModalBudgetCreateDialogComponent } from './Pages/menu/facturacion/presupuestos/modal-budget-create-dialog/modal-budget-create-dialog.component';
import { ModalBudgetDetailDialogComponent } from './Pages/menu/facturacion/presupuestos/modal-budget-detail-dialog/modal-budget-detail-dialog.component';
import { OrdenesTrabajoComponent } from './Pages/menu/facturacion/ordenes-trabajo/ordenes-trabajo.component';
import { WorOrderFilerPipe } from "./pipes/wor-order-filer.pipe";
import { ModalWorkOrderDetailDialogComponent } from './Pages/menu/facturacion/ordenes-trabajo/modal-work-order-detail-dialog/modal-work-order-detail-dialog.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ModalIntakeDetailDialogComponent } from './Pages/menu/facturacion/intake/modal-intake-detail-dialog/modal-intake-detail-dialog.component';
import { UppercaseDirective } from '../shared/uppercase.directive';
import { InvoiceFilterPipe } from "./pipes/invoice-filter.pipe";


registerLocaleData(localeEsPe);

@NgModule({
  declarations: [AppComponent,
    HeaderComponent,
    HomeComponent,
    LoginComponent,
    LayoutComponent,
    UsuariosComponent,
    ItemsComponent,
    PromocionesComponent,
    EmpleadosComponent,
    ClientesComponent,
    ModalItemDialogComponent,
    ModalEmpleadoDialogComponent,
    ModalClientesDialogComponent,
    ModalPromocionesDialogComponent,
    ItemsAdminComponent,
    FiltroEmpleadoPipe,
    FiltroItemPipe,
    FiltroClientePipe,
    FiltroPromocioPipe,
    ModalNumbersDialogComponent,
    ModalHijosDialogComponent,
    FacturacionComponent,
    KardexComponent,
    KardexModalComponent,
    SeleccionEmpleadosModalComponent,
    CajaComponent,
    VehiculosComponent,
    ManoDeObraComponent,
    MarcaComponent,
    ModalBrandDialogComponent,
    ModalModelDialogComponent,
    ModalVehicleDialogComponent,
    IntakeComponent,
    ModalIntakeDialogComponent,
    ServiciosComponent,
    ModalServiceMasterDialogComponent,
    ProductosComponent,
    MmodalProductDialogComponent,
    ModalIntakeBudgetsDialogComponent,
    PresupuestosComponent,
    ModalBudgetCreateDialogComponent,
    ModalBudgetDetailDialogComponent,
    OrdenesTrabajoComponent,
    ModalWorkOrderDetailDialogComponent,
    ModalIntakeDetailDialogComponent

  ],
  imports: [
    MatCheckboxModule,
    MatAutocompleteModule,
    BrowserModule,
    MatProgressBarModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    FormsModule,
    MatSidenavModule,
    MatMenuModule,
    MatListModule,
    MatTableModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    FiltroVehiculoPipe,
    IntakeFilterPipe,
    ServiceFilterPipe,
    ProductFilterPipe,
    BudgetFilterPipe,
    WorOrderFilerPipe,
    UppercaseDirective,
    InvoiceFilterPipe
],
  providers: [provideAnimationsAsync(), { provide: LOCALE_ID, useValue: 'es-PE' }],
  bootstrap: [AppComponent],
})
export class AppModule { }
