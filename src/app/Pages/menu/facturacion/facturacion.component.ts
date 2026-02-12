import { Component } from '@angular/core';
import { ClienteService } from '../../../../services/cliente.service';
import { ItemsService } from '../../../../services/items.service';
import { PromocionesService } from '../../../../services/promociones.service';
import { FacturacionService } from '../../../../services/facturacion.service';
import { ItemVenta } from '../../../Models/Item';
import { EmpleadosService } from '../../../../services/empleados.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { SeleccionEmpleadosModalComponent } from './seleccion-empleados-modal/seleccion-empleados-modal.component';

@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrl: './facturacion.component.scss'
})
export class FacturacionComponent {
  venta: any = {
    tipoComprobante: 'BOLETA_ELECTRONICA',
    cliente: null,
    detalles: [],
    promocionSeleccionada: null,
    total: 0,
    metodo_pago: ''
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
  dniCliente = '';
  items: any[] = [];
  ventas: any[] = [];
  clientes: any[] = [];
  itemsFiltrados: any[] = [];
  clientesFiltrados: any[] = [];
  itemsSeleccionados: any[] = [];
  series: any[] = [];
  montoIngresado: number = 0;
  empleadoBuscado: string = '';
  empleados: any[] = [];
  empleadosFiltrados: any[] = [];
  empleadosSeleccionados: any[] = [];
  mostrarListaEmpleados = false;
  timeoutEmpleados: any;
  codigoPromocional: string = '';
  tipoClienteSeleccionado: string | null = null;
  cli: any = {};

  tarjeta: any[] = [];

  constructor(
    private clienteService: ClienteService,
    private facturacionService: FacturacionService,
    private empleadoService: EmpleadosService,
    private promoService: PromocionesService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.cli.gender = "";
    this.cli.documentIdentificationType = "";
    this.venta.serieSeleccionada = ""
    this.promociones = [{
      descuentoAplicado: 0
    }];
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

  mostrarCliente() {
    this.agregarCliente = !this.agregarCliente;
  }

  loadEmpleados() {
    this.empleadoService.getEmpleadosByEstablishment().subscribe(emps => {
      this.empleados = emps;
    });
  }

  getChildren() {
    this.facturacionService.getChildren().subscribe(children => {
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

  toggleTipoCliente(tipo: string) {
    if (this.tipoClienteSeleccionado === tipo) {
      this.tipoClienteSeleccionado = null;
      this.cli.documentIdentificationType = '';
    } else {
      if (tipo === 'persona') {
        this.cli.documentIdentificationType = 'DNI';
      } else if (tipo === 'empresa') {
        this.cli.documentIdentificationType = 'RUC';
      }
      this.tipoClienteSeleccionado = tipo;
    }
  }

  consultarDocumento() {
    this.facturacionService.consultarDecolect(this.cli.documentIdentificationNumber, this.tipoClienteSeleccionado ? this.tipoClienteSeleccionado : '').subscribe(res => {
      console.log('Datos del cliente:', res);
    });
  }

  loadItems() {
    this.facturacionService.getItems().subscribe(items => {
      this.items = items;
    });
  }

  loadVentas() {
    this.facturacionService.listarVentas(this.fechaHoy).subscribe(ventas => {
      console.log(this.fechaHoy);
      this.ventas = ventas;
    });
  }

  seleccionarItem(item: any) {
    const existe = this.itemsSeleccionados.find(i => i.code === item.code);
    if (existe) return;

    const nuevoItem = { ...item, cantidad: 1 };
    this.calcularTotalesItem(nuevoItem);
    this.itemsSeleccionados.push(nuevoItem);
    this.itemBuscado = '';
    this.mostrarLista = false;
  }

  seleccionarCliente(cliente: any) {
    this.venta.cliente = cliente.client;
    console.log(this.venta.cliente);
    this.searchCliente = true;
    this.clienteBuscado = '';
    this.mostrarLista2 = false;
    this.agregarCliente = false;

    this.cargarTarjeta(this.venta.cliente.id);

    this.actualizarPromos();
  }

  cargarTarjeta(clienteId: number) {
    this.facturacionService.getTarjetaCliente(clienteId).subscribe({
      next: (res: any) => {
        this.tarjeta = res.casillas
        this.actualizarPromos();

        console.log('Descuentos disponibles:', this.promociones);
      }
    });
  }

  eliminarCliente() {
    this.venta.cliente = null;
    this.searchCliente = false;
    this.clienteBuscado = '';
  }

  calcularTotalesItem(item: ItemVenta) {
    const precioConIgv = item.value || 0;
    const cantidad = item.cantidad || 1;
    const precioSinIgv = precioConIgv / 1.18;

    item.subtotal = +(precioSinIgv * cantidad).toFixed(2);
    item.igv = +(item.subtotal * 0.18).toFixed(2);
    item.total = +(precioConIgv * cantidad).toFixed(2);
  }

  filtrarEmpleados() {
    const filtro = this.empleadoBuscado.toLowerCase();
    this.empleadosFiltrados = this.empleados.filter(e =>
      `${e.firstName} ${e.lastName}`.toLowerCase().includes(filtro)
    );
  }

  seleccionarEmpleado(empleado: any) {
    if (!this.empleadosSeleccionados.some(e => e.id === empleado.id)) {
      this.empleadosSeleccionados.push(empleado);
    }
    this.empleadoBuscado = '';
    this.mostrarListaEmpleados = false;

    const nombresConcatenados = this.empleadosSeleccionados
      .map(e => e.username)
      .join(', ');

    this.venta.observaciones = `Atendido por: ${nombresConcatenados}`;
  }

  eliminarEmpleado(empleado: any) {
    this.empleadosSeleccionados = this.empleadosSeleccionados.filter(e => e.id !== empleado.id);
  }

  ocultarListaConRetardoEmpleados() {
    this.timeoutEmpleados = setTimeout(() => (this.mostrarListaEmpleados = false), 150);
  }

  ocultarListaConRetardo() {
    setTimeout(() => (this.mostrarLista = false), 200);
  }

  ocultarListaConRetardo2() {
    setTimeout(() => (this.mostrarLista2 = false), 200);
  }

  abrirSeleccionEmpleados(item: any) {
    if (!item.empleados) {
      item.empleados = []; // Inicializamos el arreglo vacío
    }

    const dialogRef = this.dialog.open(SeleccionEmpleadosModalComponent, {
      width: '450px',
      height: '410px',
      data: {
        item,
        cantidad: item.cantidad,
        empleadosSeleccionados: [...item.empleados] // preselección
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Empleados seleccionados para el ítem:', result);
        item.empleados = result; // guardamos los empleados asignados
      }
    });
  }

  seriesComprobantes() {
    this.facturacionService.getSeries().subscribe({
      next: (res: any) => {
        this.series = res.data;
      },
      error: (err) => {
        console.error('Error al obtener series:', err);
      }
    });
  }

  anularComprobante(document: any) {
    console.log(document)
    this.facturacionService.anularComprobante(document.id).subscribe({
      next: (res: any) => {
        this.snackBar.open('Comprobante anulado correctamente.', '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
        this.loadVentas();
      },
      error: (err) => {
        console.error('Error al anular el comprobante:', err);
        this.snackBar.open('No se pudo anular el comprobante.', '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  imprimirVenta() {
    this.isLoading = true;
    const servicios = this.itemsSeleccionados.filter(item => item.item === "Servicio");

    console.log('Items seleccionados para la venta:', this.itemsSeleccionados);
    const sinEmpleados = servicios.some(item =>
      !item.empleados || item.empleados.length === 0
    );

    if (sinEmpleados) {
      this.snackBar.open(
        'Cada servicio debe tener al menos un empleado asignado.',
        '',
        {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        }
      );
      this.isLoading = false;

      return;
    }

    if (this.venta.metodo_pago === '') {
      this.snackBar.open(
        'Debe seleccionar un método de pago.',
        '',
        {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        }
      );
      this.isLoading = false;
      return;
    }

    const numeroDoc = this.venta.cliente?.documentIdentificationNumber || '';
    const tipoDocumento =
      numeroDoc.length === 8
        ? "1"
        : numeroDoc.length === 11
          ? "6"
          : "4";

    const itemsParaEnviar = this.itemsSeleccionados.map(item => ({
      ...item,
      empleados: item.empleados || []
    }));

    const resumenVenta = {
      items: itemsParaEnviar,
      subtotalGeneral: this.subtotalGeneral.toFixed(2),
      igvGeneral: this.igvGeneral.toFixed(2),
      totalGeneral: this.totalGeneral.toFixed(2),
      observaciones: this.venta.observaciones || '',
      tipo_de_comprobante: this.venta.serieSeleccionada.tipoComprobante,
      cliente_numero: this.venta.cliente?.documentIdentificationNumber || '',
      cliente_nombre: this.venta.cliente?.firstName + ' ' + this.venta.cliente?.lastName,
      serie: this.venta.serieSeleccionada.serie,
      cliente_tipo_documento: tipoDocumento,
      metodo_pago: this.venta.metodo_pago || '',
      fecha_emision: this.fechaBoleteoHoy,
      codigoPromocional: this.codigoPromocional || ''
    };

    this.facturacionService.registrarVenta(resumenVenta).subscribe(
      (res: any) => {
        this.isLoading = false;
        if (res.success) {
          this.snackBar.open(res.message, '', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
          });
          this.itemsSeleccionados = [];
          this.venta.metodo_pago = '';
          this.venta.serieSeleccionada = '';
          this.venta.observaciones = '';
          this.fechaBoleteoHoy = new Date().toISOString().substring(0, 10);

        } else {
          this.snackBar.open(res.message, '', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
        }

        this.loadVentas();
      },
      (error) => {
        this.isLoading = false;
        console.error('Error al registrar la venta:', error);
        this.snackBar.open(
          error?.error?.message || 'Ocurrió un error al registrar la venta.',
          '',
          {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          }
        );
      }
    );

  }

  obtenerProductividad() {
    this.facturacionService.obtenerProductividad(this.fechaHoy).subscribe(blob => {
      const objectUrl = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = 'productividad.xlsx';
      a.click();

      URL.revokeObjectURL(objectUrl);
    });
  }

  downloadPDF(url: string) {
    this.facturacionService.descargarPDF(url).subscribe(blob => {

      const objectUrl = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = 'comprobante.pdf'; // nombre estático o dinámico
      a.click();

      URL.revokeObjectURL(objectUrl);
    });
  }

  eliminarItem(index: number) {
    this.itemsSeleccionados.splice(index, 1);
    this.actualizarTotal();
  }

  actualizarTotal() {
    this.venta.total = this.venta.detalles.reduce(
      (sum: number, d: any) => sum + d.cantidad * d.precioUnitario,
      0
    );

    if (this.venta.promocionSeleccionada) this.aplicarDescuento();
  }

  actualizarTotales(item: ItemVenta) {
    this.calcularTotalesItem(item);
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


  reporteMensual() {
    this.facturacionService.reporteDiario(this.fechaHoy).subscribe(blob => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = `ReporteDiario_${new Date().toISOString().slice(0, 10)}.xlsx`;
      a.click();
      URL.revokeObjectURL(objectUrl);
    });
  }

  reporteDiario() {
    this.facturacionService.reporteDiario2(this.fechaHoy).subscribe(blob => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = `ReporteDiario_${new Date().toISOString().slice(0, 10)}.xlsx`;
      a.click();
      URL.revokeObjectURL(objectUrl);
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
          setTimeout(() => {
            URL.revokeObjectURL(fileURL);
            iframe.remove();
          }, 5000);
        };
      },
      error: (err) => {
        console.error('Error al imprimir PDF:', err);
        alert('No se pudo imprimir el comprobante.');
      }
    });
  }

  aplicarDescuento() {
    const descuento = Number(this.promoTarjeta) || 0;

    this.itemsSeleccionados.forEach(item => {
      const precioConIgv = item.value;
      const cantidad = item.cantidad;

      // total sin descuento
      const totalOriginal = precioConIgv * cantidad;

      // aplicar descuento
      const totalConDescuento = +(totalOriginal * (1 - descuento / 100)).toFixed(2);

      // recalcular valores sin IGV
      const subtotal = +(totalConDescuento / 1.18).toFixed(2);
      const igv = +(subtotal * 0.18).toFixed(2);

      // asignar nuevos valores al item
      item.total = totalConDescuento;
      item.subtotal = subtotal;
      item.igv = igv;
    });
  }


  onPromoChange() {
    console.log('Promoción seleccionada:', this.promoTarjeta);
    if (!this.promoTarjeta || this.promoTarjeta == 0) {
      this.quitarDescuento();
    } else {
      this.aplicarDescuento();
    }
  }

  quitarDescuento() {
    this.itemsSeleccionados.forEach(item => {
      const precioConIgv = item.value;
      const cantidad = item.cantidad;

      item.subtotal = +((precioConIgv / 1.18) * cantidad).toFixed(2);
      item.igv = +(item.subtotal * 0.18).toFixed(2);
      item.total = +(precioConIgv * cantidad).toFixed(2);
    });
  }

  guardarVenta() {
    console.log('Venta guardada:', this.venta);
  }

  cancelar() {
    this.venta = { tipoComprobante: 'BOLETA_ELECTRONICA', cliente: null, detalles: [], total: 0 };
  }

  marcar(casilla: any) {
    casilla.marcada = !casilla.marcada;

    this.facturacionService.registrarVisita(this.venta.cliente.id)
      .subscribe(() => {
        this.cargarTarjeta(this.venta.cliente.id);

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

  resetTarjeta() {
    this.facturacionService.resetTarjeta(this.venta.cliente.id)
      .subscribe(() => {
        this.cargarTarjeta(this.venta.cliente.id);
      });
  }


  actualizarPromos() {

    this.promociones = [];   // limpiar

    const descuento = this.descuentoDisponible;

    if (descuento > 0) {
      this.promociones.push({
        descuentoAplicado: descuento
      });

      // this.promoTarjeta = descuento;   // seleccionar automático
    }
    else {
      this.promoTarjeta = 0;
    }
  }

}
