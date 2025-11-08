import { Component } from '@angular/core';
import { ClienteService } from '../../../../services/cliente.service';
import { ItemsService } from '../../../../services/items.service';
import { PromocionesService } from '../../../../services/promociones.service';
import { FacturacionService } from '../../../../services/facturacion.service';
import { ItemVenta } from '../../../Models/Item';
import { EmpleadosService } from '../../../../services/empleados.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    total: 0
  };
  itemBuscado = '';

  mostrarLista = false;
  mostrarLista2 = false;
  agregarCliente = false;
  searchCliente = false;

  clienteBuscado = '';
  promociones: any[] = [];
  dniCliente = '';
  items: any[] = [];
  ventas: any[] = [];
  clientes: any[] = [];
  itemsFiltrados: any[] = [];
  clientesFiltrados: any[] = [];
  itemsSeleccionados: any[] = [];
  series: any[] = [];

  empleadoBuscado: string = '';
  empleados: any[] = [];
  empleadosFiltrados: any[] = [];
  empleadosSeleccionados: any[] = [];
  mostrarListaEmpleados = false;
  timeoutEmpleados: any;

  tipoClienteSeleccionado: string | null = null;
  cli: any = {};

  constructor(
    private clienteService: ClienteService,
    private facturacionService: FacturacionService,
    private empleadoService: EmpleadosService,
    private promoService: PromocionesService,
    private snackBar: MatSnackBar
  ) {
    this.cli.gender = "";
    this.cli.documentIdentificationType = "";
    this.venta.serieSeleccionada = ""
  }

  ngOnInit() {
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
    this.facturacionService.listarVentas().subscribe(ventas => {
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
    this.searchCliente = true;
    this.clienteBuscado = '';
    this.mostrarLista2 = false;
    this.agregarCliente = false;
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

  imprimirVenta() {
    const numeroDoc = this.venta.cliente?.documentIdentificationNumber || '';
    const tipoDocumento = numeroDoc.length === 8 ? 1 : 6;

    const resumenVenta = {
      items: this.itemsSeleccionados,
      subtotalGeneral: this.subtotalGeneral.toFixed(2),
      igvGeneral: this.igvGeneral.toFixed(2),
      totalGeneral: this.totalGeneral.toFixed(2),
      observaciones: this.venta.observaciones || '',
      tipo_de_comprobante: this.venta.serieSeleccionada.tipoComprobante,
      cliente_numero: "10756841497", //numeroDoc,
      cliente_nombre: this.venta.cliente?.firstName + ' ' + this.venta.cliente?.lastName,
      serie: "FFF1", //this.venta.serieSeleccionada.serie,
      cliente_tipo_documento: "6"//tipoDocumento,
    };

    this.facturacionService.registrarVenta(resumenVenta).subscribe(
      (res: any) => {

        if (res.success) {
          this.snackBar.open(res.message, '', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
          });
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


  aplicarDescuento() {
    if (!this.venta.promocionSeleccionada) return;
    const promo = this.venta.promocionSeleccionada;
    this.venta.total -= promo.value;
  }

  guardarVenta() {
    console.log('Venta guardada:', this.venta);
  }

  cancelar() {
    this.venta = { tipoComprobante: 'BOLETA_ELECTRONICA', cliente: null, detalles: [], total: 0 };
  }
}
