import { NgModule } from '@angular/core';
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
import { QRCodeModule } from 'angularx-qrcode';

import { ModalNumbersDialogComponent } from './Pages/menu/configuracion/clientes/modal-numbers-dialog/modal-numbers-dialog.component';
import { ModalHijosDialogComponent } from './Pages/menu/configuracion/clientes/modal-hijos-dialog/modal-hijos-dialog.component';
import { FacturacionComponent } from './Pages/menu/facturacion/facturacion.component';
import { KardexComponent } from './Pages/menu/configuracion/kardex/kardex.component';
import { KardexModalComponent } from './Pages/menu/configuracion/kardex/kardex-modal/kardex-modal.component';
import { SeleccionEmpleadosModalComponent } from './Pages/menu/facturacion/seleccion-empleados-modal/seleccion-empleados-modal.component';
import { CajaComponent } from './Pages/menu/facturacion/caja/caja.component';
import { ResumenComponent } from './Pages/menu/dashboard/resumen/resumen.component';
import { BaseChartDirective } from 'ng2-charts';

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
    ResumenComponent

  ],
  imports: [
    BaseChartDirective,
    QRCodeModule,
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
    RouterModule.forRoot(routes)
  ],
  providers: [provideAnimationsAsync()],
  bootstrap: [AppComponent],
})
export class AppModule { }
