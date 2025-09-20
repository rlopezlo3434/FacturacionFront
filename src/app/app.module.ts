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
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import { UsuariosComponent } from './Pages/menu/usuarios/usuarios.component';
import { MatTableModule } from '@angular/material/table';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
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
@NgModule({
  declarations: [AppComponent, HeaderComponent, HomeComponent, LoginComponent, LayoutComponent, UsuariosComponent, ItemsComponent, PromocionesComponent, EmpleadosComponent, ClientesComponent, ModalItemDialogComponent, ModalEmpleadoDialogComponent, ModalClientesDialogComponent, ModalPromocionesDialogComponent],
  imports: [
    BrowserModule,
    MatProgressBarModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    FormsModule,
    MatSidenavModule,
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
export class AppModule {}
