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
  promoTarjeta = 0;
  promociones: [{
    descuentoAplicado: number
  }];
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

  tipoClienteSeleccionado: string | null = null;
  cli: any = {};


  selectedItems = [];
  searchText = '';
  client = {
    name: 'CONSTRUCTORA DEL NORTE S.A.C.',
    document: '20456789123'
  };

  documentType = 'FACTURA';

  subTotal = 0;
  igv = 0;
  total = 0;
  serie: string = 'F002';
  invoiceItems: any[] = [];

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
    // this.loadItems();
    // this.getChildren();
    // this.loadEmpleados();
    this.loadVentas();
    this.seriesComprobantes();
    this.loadApprovedItems();
  }


  loadApprovedItems() {
    this.facturacionService
      .getApprovedItems()
      .subscribe(res => {
        this.invoiceItems = res.data;
        this.recalculateInvoice();

      });
  }

  recalculateInvoice() {

    this.itemsSeleccionados =
      this.invoiceItems.filter(x => x.selected)
        .map(x => ({
          ...x,
          codigo: x.intakeCode,
          description: x.description,
          value: x.subTotal,
          cantidad: x.quantity,
        }));
    console.log('Items seleccionados:', this.itemsSeleccionados);
    const selected =
      this.invoiceItems.filter((x: any) => x.selected);

    this.subTotal =
      selected.reduce((a: any, b: any) => a + b.subTotal, 0);

    this.igv = this.subTotal * 0.18;
    this.total = this.subTotal + this.igv;
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

  setDocumentType(type: 'FACTURA' | 'BOLETA') {

    this.documentType = type;

    if (type === 'FACTURA') {
      this.serie = 'F002';
    } else {
      this.serie = 'B002';
    }
  }

  imprimirVenta() {
    this.isLoading = true;

    const items = 
      this.invoiceItems.filter(x => x.selected)
        .map(x => ({
          ...x,
          code: x.intakeCode,
          description: x.description,
          value: x.subTotal,
          cantidad: x.quantity,
        }));
    const numeroDoc = this.venta.cliente?.documentIdentificationNumber || '';
    const tipoDocumento = numeroDoc.length === 8 ? "1" : "6";
    console.log('Número de documento del cliente:', items);
    const resumenVenta = {
      items: items,
      // subtotalGeneral: this.subtotalGeneral.toFixed(2),
      // igvGeneral: this.igvGeneral.toFixed(2),
      // totalGeneral: this.totalGeneral.toFixed(2),
      observaciones: this.venta.observaciones || '',
      tipo_de_comprobante: this.venta.serieSeleccionada.tipoComprobante,
      cliente_numero: this.venta.cliente?.documentIdentificationNumber || '',
      cliente_nombre: this.venta.cliente?.firstName + ' ' + this.venta.cliente?.lastName,
      serie: this.serie,
      cliente_tipo_documento: tipoDocumento,
      metodo_pago: this.venta.metodo_pago || 'EFECTIVO',
      fecha_emision: this.fechaBoleteoHoy
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
    this.facturacionService.obtenerProductividad().subscribe(blob => {
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



  reporteDiario() {
    this.facturacionService.reporteDiario(this.fechaHoy).subscribe(blob => {
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
}
