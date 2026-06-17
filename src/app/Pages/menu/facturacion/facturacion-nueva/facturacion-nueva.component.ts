import { Component, OnInit } from '@angular/core';
import { FacturacionService } from '../../../../../services/facturacion.service';
import { ItemVenta } from '../../../../Models/Item';
import { EmpleadosService } from '../../../../../services/empleados.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { SeleccionEmpleadosModalComponent } from '../seleccion-empleados-modal/seleccion-empleados-modal.component';

@Component({
  selector: 'app-facturacion-nueva',
  templateUrl: './facturacion-nueva.component.html',
  styleUrl: './facturacion-nueva.component.scss'
})
export class FacturacionNuevaComponent implements OnInit {

  tabActiva: 'facturar' | 'pendientes' | 'historial' = 'facturar';
  historialBusqueda = '';

  venta: any = {
    tipoComprobante: 'BOLETA_ELECTRONICA',
    cliente: null,
    detalles: [],
    promocionSeleccionada: null,
    total: 0,
    metodo_pago: '',
    serieSeleccionada: '',
    observaciones: ''
  };

  itemBuscado = '';
  isLoading = false;
  mostrarLista = false;
  mostrarLista2 = false;
  agregarCliente = false;
  searchCliente = false;
  fechaHoy: string = new Date().toISOString().substring(0, 10);
  fechaBoleteoHoy: string = new Date().toISOString().substring(0, 10);
  clienteBuscado = '';
  promociones: any[] = [];
  promoTarjeta = 0;
  items: any[] = [];
  ventas: any[] = [];
  clientes: any[] = [];
  itemsFiltrados: any[] = [];
  clientesFiltrados: any[] = [];
  itemsSeleccionados: any[] = [];
  series: any[] = [];
  montoIngresado = 0;
  empleados: any[] = [];
  codigoPromocional = '';
  tipoClienteSeleccionado: string | null = null;
  cli: any = {};
  tarjeta: any[] = [];
  childrenClientId: number | null = null;
  preVentasPendientes: any[] = [];

  constructor(
    private facturacionService: FacturacionService,
    private empleadoService: EmpleadosService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.cli.gender = '';
    this.cli.documentIdentificationType = '';
    this.promociones = [{ descuentoAplicado: 0 }];
  }

  ngOnInit() {
    const hoy = new Date();
    hoy.setMinutes(hoy.getMinutes() - hoy.getTimezoneOffset());
    this.fechaHoy = hoy.toISOString().substring(0, 10);
    this.fechaBoleteoHoy = hoy.toISOString().substring(0, 10);
    this.loadItems();
    this.getChildren();
    this.loadEmpleados();
    this.loadVentas();
    this.seriesComprobantes();
  }

  setTab(tab: 'facturar' | 'pendientes' | 'historial') {
    this.tabActiva = tab;
    if (tab === 'pendientes') this.loadPreVentasPendientes();
    if (tab === 'historial') this.loadVentas();
  }

  get ventasFiltradas() {
    const q = this.historialBusqueda.toLowerCase();
    if (!q) return this.ventas;
    return this.ventas.filter(v =>
      (v.serie + '-' + v.numero).toLowerCase().includes(q) ||
      (v.tipoComprobante || '').toLowerCase().includes(q) ||
      String(v.total).includes(q)
    );
  }

  get totalDia(): number {
    return this.ventas.filter(v => !v.anulado).reduce((a, v) => a + (v.total || 0), 0);
  }

  get countAnulados(): number {
    return this.ventas.filter(v => v.anulado).length;
  }

  loadEmpleados() {
    this.empleadoService.getEmpleadosByEstablishment().subscribe((emps: any) => {
      this.empleados = emps;
    });
  }

  getChildren() {
    this.facturacionService.getChildren().subscribe((children: any) => {
      this.clientes = children;
    });
  }

  filtrarItems() {
    const filtro = this.itemBuscado.toLowerCase();
    this.itemsFiltrados = this.items.filter(x =>
      x.description.toLowerCase().includes(filtro)
    );
  }

  filtrarClientes() {
    const filtro = this.clienteBuscado.toLowerCase();
    this.clientesFiltrados = this.clientes.filter(x =>
      `${x.firstName} ${x.lastName}`.toLowerCase().includes(filtro)
    );
  }

  loadItems() {
    this.facturacionService.getItems().subscribe((items: any) => {
      this.items = items;
    });
  }

  loadVentas() {
    this.facturacionService.listarVentas(this.fechaHoy).subscribe((ventas: any) => {
      this.ventas = ventas;
    });
  }

  seleccionarItem(item: any) {
    const existe = this.itemsSeleccionados.find(i => i.code === item.code);
    if (existe) {
      existe.cantidad++;
      this.calcularTotalesItem(existe);
      this.itemBuscado = '';
      this.mostrarLista = false;
      return;
    }
    const nuevoItem = { ...item, cantidad: 1 };
    this.calcularTotalesItem(nuevoItem);
    this.itemsSeleccionados.push(nuevoItem);
    this.itemBuscado = '';
    this.mostrarLista = false;
  }

  seleccionarCliente(cliente: any) {
    this.venta.cliente = cliente.client;
    this.childrenClientId = cliente.id;
    this.searchCliente = true;
    this.clienteBuscado = '';
    this.mostrarLista2 = false;
    this.agregarCliente = false;
    this.cargarTarjeta();
    this.actualizarPromos();
  }

  cargarTarjeta() {
    if (!this.childrenClientId) return;
    this.facturacionService.getTarjetaCliente(this.childrenClientId).subscribe({
      next: (res: any) => {
        this.tarjeta = res.casillas;
        this.actualizarPromos();
      }
    });
  }

  eliminarCliente() {
    this.venta.cliente = null;
    this.childrenClientId = null;
    this.searchCliente = false;
    this.clienteBuscado = '';
    this.agregarCliente = false;
    this.tarjeta = [];
    this.promociones = [{ descuentoAplicado: 0 }];
    this.promoTarjeta = 0;
  }

  calcularTotalesItem(item: ItemVenta) {
    const precioConIgv = item.value || 0;
    const cantidad = item.cantidad || 1;
    const precioSinIgv = precioConIgv / 1.18;
    item.subtotal = +(precioSinIgv * cantidad).toFixed(2);
    item.igv = +(item.subtotal * 0.18).toFixed(2);
    item.total = +(precioConIgv * cantidad).toFixed(2);
  }

  actualizarTotales(item: ItemVenta) {
    this.calcularTotalesItem(item);
    if (this.promoTarjeta > 0) this.aplicarDescuento();
  }

  incrementarCantidad(item: any) {
    item.cantidad++;
    this.actualizarTotales(item);
  }

  decrementarCantidad(item: any) {
    if (item.cantidad > 1) {
      item.cantidad--;
      this.actualizarTotales(item);
    }
  }

  eliminarItem(item: any) {
    const idx = this.itemsSeleccionados.indexOf(item);
    if (idx > -1) this.itemsSeleccionados.splice(idx, 1);
  }

  limpiarTodo() {
    this.itemsSeleccionados = [];
    this.promoTarjeta = 0;
    this.codigoPromocional = '';
  }

  get subtotalGeneral() {
    return this.itemsSeleccionados.reduce((acc, i) => acc + (i.subtotal || 0), 0);
  }

  get igvGeneral() {
    return this.itemsSeleccionados.reduce((acc, i) => acc + (i.igv || 0), 0);
  }

  get totalGeneral() {
    return this.itemsSeleccionados.reduce((acc, i) => acc + (i.total || 0), 0);
  }

  get descuentoTotal() {
    if (!this.promoTarjeta) return 0;
    const totalOriginal = this.itemsSeleccionados.reduce((acc, i) => acc + ((i.originalValue || i.value) * i.cantidad), 0);
    return +(totalOriginal * (this.promoTarjeta / 100)).toFixed(2);
  }

  seriesComprobantes() {
    this.facturacionService.getSeries().subscribe({
      next: (res: any) => {
        this.series = res.data;
        this.loadPreVentasPendientes();
      },
      error: () => { this.loadPreVentasPendientes(); }
    });
  }

  ocultarListaConRetardo() {
    setTimeout(() => (this.mostrarLista = false), 200);
  }

  ocultarListaConRetardo2() {
    setTimeout(() => (this.mostrarLista2 = false), 200);
  }

  abrirSeleccionEmpleados(item: any) {
    if (!item.empleados) item.empleados = [];
    const dialogRef = this.dialog.open(SeleccionEmpleadosModalComponent, {
      width: '450px',
      height: '410px',
      data: { item, cantidad: item.cantidad, empleadosSeleccionados: [...item.empleados] }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) item.empleados = result;
    });
  }

  aplicarDescuento() {
    const descuento = Number(this.promoTarjeta) || 0;
    this.itemsSeleccionados.forEach(item => {
      if (!item.originalValue) item.originalValue = item.value;
      const precioConIgv = item.originalValue;
      const cantidad = item.cantidad;
      const totalConDescuento = +(precioConIgv * cantidad * (1 - descuento / 100)).toFixed(2);
      const subtotal = +(totalConDescuento / 1.18).toFixed(2);
      item.value = +(precioConIgv * (1 - descuento / 100)).toFixed(2);
      item.total = totalConDescuento;
      item.subtotal = subtotal;
      item.igv = +(subtotal * 0.18).toFixed(2);
    });
  }

  quitarDescuento() {
    this.itemsSeleccionados.forEach(item => {
      if (item.originalValue) item.value = item.originalValue;
      const precioConIgv = item.value;
      const cantidad = item.cantidad;
      item.subtotal = +((precioConIgv / 1.18) * cantidad).toFixed(2);
      item.igv = +(item.subtotal * 0.18).toFixed(2);
      item.total = +(precioConIgv * cantidad).toFixed(2);
    });
  }

  onPromoChange() {
    if (!this.promoTarjeta || this.promoTarjeta == 0) {
      this.quitarDescuento();
    } else {
      this.aplicarDescuento();
    }
  }

  aplicarCodigoPromocional() {
    if (!this.codigoPromocional.trim()) return;
    this.snackBar.open('Código aplicado: ' + this.codigoPromocional, '', {
      duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'
    });
  }

  actualizarPromos() {
    this.promociones = [];
    const descuento = this.descuentoDisponible;
    if (descuento > 0) {
      this.promociones.push({ descuentoAplicado: descuento });
    } else {
      this.promoTarjeta = 0;
    }
  }

  marcar(casilla: any) {
    if (!this.childrenClientId) return;
    casilla.marcada = !casilla.marcada;
    this.facturacionService.registrarVisita(this.childrenClientId).subscribe(() => {
      this.cargarTarjeta();
    });
  }

  resetTarjeta() {
    if (!this.childrenClientId) return;
    this.facturacionService.resetTarjeta(this.childrenClientId).subscribe(() => {
      this.cargarTarjeta();
    });
  }

  get tarjetaCompleta(): boolean {
    return this.tarjeta?.length > 0 && this.tarjeta.every(c => c.marcada);
  }

  get visitasMarcadas(): number {
    return this.tarjeta?.filter(c => c.marcada).length ?? 0;
  }

  get descuentoDisponible(): number {
    switch (this.visitasMarcadas) {
      case 3: return 5;
      case 6: return 10;
      case 9: return 15;
      case 12: return 20;
      default: return 0;
    }
  }

  buildPayload() {
    const numeroDoc = this.venta.cliente?.documentIdentificationNumber || '';
    const tipoDocumento = numeroDoc.length === 8 ? '1' : numeroDoc.length === 11 ? '6' : '4';
    const itemsParaEnviar = this.itemsSeleccionados.map(item => ({ ...item, empleados: item.empleados || [] }));
    return {
      items: itemsParaEnviar,
      subtotalGeneral: this.subtotalGeneral.toFixed(2),
      igvGeneral: this.igvGeneral.toFixed(2),
      totalGeneral: this.totalGeneral.toFixed(2),
      observaciones: this.venta.observaciones || '',
      tipo_de_comprobante: this.venta.serieSeleccionada?.tipoComprobante ?? 2,
      cliente_numero: numeroDoc,
      cliente_nombre: (this.venta.cliente?.firstName || '') + ' ' + (this.venta.cliente?.lastName || ''),
      serie: this.venta.serieSeleccionada?.serie || '',
      cliente_tipo_documento: tipoDocumento,
      metodo_pago: this.venta.metodo_pago || '',
      fecha_emision: this.fechaBoleteoHoy,
      codigoPromocional: this.codigoPromocional || '',
      porcentajePromo: this.promoTarjeta
    };
  }

  validarParaVenta(): boolean {
    const servicios = this.itemsSeleccionados.filter(item => item.item === 'Servicio');
    const sinEmpleados = servicios.some(item => !item.empleados || item.empleados.length === 0);
    if (sinEmpleados) {
      this.snackBar.open('Cada servicio debe tener al menos un empleado asignado.', '', {
        duration: 3000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar']
      });
      return false;
    }
    if (!this.itemsSeleccionados.length) {
      this.snackBar.open('Agrega al menos un ítem.', '', {
        duration: 3000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar']
      });
      return false;
    }
    if (!this.venta.metodo_pago) {
      this.snackBar.open('Selecciona un método de pago.', '', {
        duration: 3000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar']
      });
      return false;
    }
    return true;
  }

  emitirVenta() {
    if (!this.validarParaVenta()) return;
    this.isLoading = true;
    this.facturacionService.registrarVenta(this.buildPayload()).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.success) {
          this.snackBar.open(res.message, '', {
            duration: 3000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['success-snackbar']
          });
          this.resetForm();
        } else {
          this.snackBar.open(res.message, '', {
            duration: 3000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar']
          });
        }
        this.loadVentas();
      },
      error: (err: any) => {
        this.isLoading = false;
        this.snackBar.open(err?.error?.message || 'Error al registrar la venta.', '', {
          duration: 3000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar']
        });
      }
    });
  }

  registrarPreVenta() {
    if (!this.itemsSeleccionados.length) {
      this.snackBar.open('Agrega al menos un ítem.', '', {
        duration: 3000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar']
      });
      return;
    }
    this.isLoading = true;
    this.facturacionService.registrarPreVenta(this.buildPayload()).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.snackBar.open(res?.message || 'Pre-venta registrada', '', {
          duration: 3000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['success-snackbar']
        });
        this.resetForm();
        this.loadPreVentasPendientes();
      },
      error: (err: any) => {
        this.isLoading = false;
        this.snackBar.open(err?.error?.message || 'Error al registrar pre-venta', '', {
          duration: 3000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar']
        });
      }
    });
  }

  resetForm() {
    this.itemsSeleccionados = [];
    this.venta.metodo_pago = '';
    this.venta.serieSeleccionada = '';
    this.venta.observaciones = '';
    this.codigoPromocional = '';
    this.promoTarjeta = 0;
    this.fechaBoleteoHoy = new Date().toISOString().substring(0, 10);
  }

  // PRE-VENTAS PENDIENTES
  loadPreVentasPendientes() {
    this.facturacionService.getPreVentasPendientes().subscribe({
      next: (res: any) => {
        const lista = res?.data || res || [];
        lista.forEach((pv: any) => {
          const match = this.series.find(s =>
            (s.tipo || '').toUpperCase().includes((pv.tipoComprobante || '').toUpperCase())
          );
          pv.serieEmision = match?.serie || '';
        });
        this.preVentasPendientes = lista;
      },
      error: () => { this.preVentasPendientes = []; }
    });
  }

  emitirPreVenta(pv: any) {
    if (!pv.serieEmision) {
      this.snackBar.open('No hay serie asignada para emitir.', '', {
        duration: 3000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar']
      });
      return;
    }
    pv.emitiendo = true;
    this.facturacionService.emitirPreVenta(pv.id, pv.serieEmision).subscribe({
      next: (res: any) => {
        pv.emitiendo = false;
        this.snackBar.open(res?.message || 'Comprobante emitido', '', {
          duration: 3000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['success-snackbar']
        });
        this.loadPreVentasPendientes();
        this.loadVentas();
      },
      error: (err: any) => {
        pv.emitiendo = false;
        this.snackBar.open(err?.error?.message || 'Error al emitir', '', {
          duration: 3000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar']
        });
      }
    });
  }

  eliminarPreVenta(pv: any) {
    pv.eliminando = true;
    this.facturacionService.eliminarPreVenta(pv.id).subscribe({
      next: (res: any) => {
        this.snackBar.open(res?.message || 'Pre-venta eliminada', '', {
          duration: 3000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['success-snackbar']
        });
        this.loadPreVentasPendientes();
      },
      error: (err: any) => {
        pv.eliminando = false;
        this.snackBar.open(err?.error?.message || 'Error al eliminar', '', {
          duration: 3000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar']
        });
      }
    });
  }

  anularComprobante(v: any) {
    this.facturacionService.anularComprobante(v.id).subscribe({
      next: () => {
        this.snackBar.open('Comprobante anulado.', '', {
          duration: 3000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['success-snackbar']
        });
        this.loadVentas();
      },
      error: () => {
        this.snackBar.open('No se pudo anular.', '', {
          duration: 3000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar']
        });
      }
    });
  }

  imprimirPdf(url: string) {
    this.facturacionService.imprimirPdf(url).subscribe({
      next: (blob: Blob) => {
        const fileURL = URL.createObjectURL(blob);
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = fileURL;
        document.body.appendChild(iframe);
        iframe.onload = () => {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
          setTimeout(() => { URL.revokeObjectURL(fileURL); iframe.remove(); }, 5000);
        };
      }
    });
  }

  downloadPDF(url: string) {
    this.facturacionService.descargarPDF(url).subscribe(blob => {
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = 'comprobante.pdf';
      a.click();
      URL.revokeObjectURL(objectUrl);
    });
  }

  get totalPendiente(): number {
    return this.preVentasPendientes.reduce((a, pv) => a + (pv.total || 0), 0);
  }

  reporteMensual() {
    this.facturacionService.reporteDiario(this.fechaHoy).subscribe(blob => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = `ReporteMensual.xlsx`;
      a.click();
      URL.revokeObjectURL(objectUrl);
    });
  }

  reporteDiario() {
    this.facturacionService.reporteDiario2(this.fechaHoy).subscribe(blob => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = `ReporteDiario.xlsx`;
      a.click();
      URL.revokeObjectURL(objectUrl);
    });
  }

  descargarReporteProductividad() {
    this.facturacionService.obtenerProductividad(this.fechaHoy).subscribe(blob => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = `productividad.xlsx`;
      a.click();
      URL.revokeObjectURL(objectUrl);
    });
  }
}
