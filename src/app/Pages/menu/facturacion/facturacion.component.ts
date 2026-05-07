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
import { SidebarService } from '../../../../services/sidebar.service';

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

  paymentCondition: string = 'CONTADO';
  cuotas: number = 1;
  cuotasDetalle: any[] = [];
  diasCredito: number = 1;
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
  clienteInfoItem: { nombre: string; numero: string } | null = null;
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
    name: '',
    document: '',
    address: ''
  };
  clientDocumentInput = '';
  clientLookupLoading = false;
  showOnlyPendingInvoices = false;

  documentType = 'FACTURA';

  subTotal = 0;
  igv = 0;
  total = 0;
  serie: string = 'F002';
  invoiceItems: any[] = [];

  applyDetraccion = false;

  detraccionPercent = 12;

  detraccionAmount = 0;
  totalPagar = 0;

  detraccionTipo: number | null = null;
  detraccionSearch = '';

  detracciones = [
    { codigo: 1, descripcion: '001 Azúcar y melaza de caña' },
    { codigo: 2, descripcion: '002 Arroz' },
    { codigo: 3, descripcion: '003 Alcohol etílico' },
    { codigo: 4, descripcion: '004 Recursos Hidrobiológicos' },
    { codigo: 5, descripcion: '005 Maíz amarillo duro' },
    { codigo: 7, descripcion: '007 Caña de azúcar' },
    { codigo: 8, descripcion: '008 Madera' },
    { codigo: 9, descripcion: '009 Arena y piedra' },
    { codigo: 10, descripcion: '010 Residuos, subproductos, desechos, recortes y desperdicios' },
    { codigo: 11, descripcion: '011 Bienes gravados con el IGV, o renuncia a la exoneración' },
    { codigo: 12, descripcion: '012 Intermediación laboral y tercerización' },
    { codigo: 13, descripcion: '014 Carnes y despojos comestibles' },
    { codigo: 14, descripcion: '016 Aceite de pescado' },
    { codigo: 15, descripcion: '017 Harina, polvo y pellets de pescado, crustáceos, moluscos y demás invertebrados acuáticos' },
    { codigo: 17, descripcion: '019 Arrendamiento de bienes muebles' },
    { codigo: 18, descripcion: '020 Mantenimiento y reparación de bienes muebles' },
    { codigo: 19, descripcion: '021 Movimiento de carga' },
    { codigo: 20, descripcion: '022 Otros servicios empresariales' },
    { codigo: 21, descripcion: '023 Leche' },
    { codigo: 22, descripcion: '024 Comisión mercantil' },
    { codigo: 23, descripcion: '025 Fabricación de bienes por encargo' },
    { codigo: 24, descripcion: '026 Servicio de transporte de personas' },
    { codigo: 25, descripcion: '027 Servicio de transporte de carga' },
    { codigo: 26, descripcion: '028 Transporte de pasajeros' },
    { codigo: 28, descripcion: '030 Contratos de construcción' },
    { codigo: 29, descripcion: '031 Oro gravado con el IGV' },
    { codigo: 30, descripcion: '032 Paprika y otros frutos de los generos capsicum o pimienta' },
    { codigo: 32, descripcion: '034 Minerales metálicos no auríferos' },
    { codigo: 33, descripcion: '035 Bienes exonerados del IGV' },
    { codigo: 34, descripcion: '036 Oro y demás minerales metálicos exonerados del IGV' },
    { codigo: 35, descripcion: '037 Demás servicios gravados con el IGV' },
    { codigo: 37, descripcion: '039 Minerales no metálicos' },
    { codigo: 38, descripcion: '040 Bien inmueble gravado con IGV' },
    { codigo: 39, descripcion: '041 Plomo' },
    { codigo: 40, descripcion: '013 Animales vivos' },
    { codigo: 41, descripcion: '015 Abonos, cueros y pieles de origen animal' },
    { codigo: 42, descripcion: '099 Ley 30737' },
    { codigo: 43, descripcion: '044 Servicio de beneficio de minerales metálicos gravado con el IGV' },
    { codigo: 44, descripcion: '045 Minerales de oro y sus concentrados gravados con el IGV' }
  ];
  showDetraccionDropdown = false;
  filteredDetracciones = [...this.detracciones];
  constructor(
    private clienteService: ClienteService,
    private facturacionService: FacturacionService,
    private empleadoService: EmpleadosService,
    private promoService: PromocionesService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private sidebarService: SidebarService

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
    this.venta.tipoComprobante = '1';
  }


  onPaymentConditionChange() {
    this.cuotasDetalle = [];
    this.cuotas = 1;

    if (this.paymentCondition === 'CONTADO') {
      return;
    }

    if (this.paymentCondition === 'CREDITO_DIAS') {
      this.diasCredito = 1;
      this.generarUnaCuota(this.diasCredito);
      return;
    }

    if (this.paymentCondition === 'CREDITO_CUOTAS') {
      this.cuotas = 1;
      this.generarCuotas();
    }
  }

  onDiasCreditoChange() {
    const dias = Math.min(30, Math.max(1, this.diasCredito || 1));
    this.diasCredito = dias;
    this.generarUnaCuota(dias);
  }

  generarUnaCuota(dias: number) {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + dias);
    console.log("entre")
    this.cuotasDetalle = [
      {
        cuota: 1,
        fecha: this.formatDate(fecha),
        importe: this.total
      }
    ];
  }

  generarCuotas() {
    if (!this.cuotas || this.cuotas <= 0) return;

    this.cuotasDetalle = [];

    const montoPorCuota = this.total / this.cuotas;
    const fechaBase = new Date();

    for (let i = 1; i <= this.cuotas; i++) {
      const fecha = new Date(fechaBase);
      fecha.setMonth(fecha.getMonth() + i);

      this.cuotasDetalle.push({
        cuota: i,
        fecha: this.formatDate(fecha),
        importe: parseFloat(montoPorCuota.toFixed(2))
      });
    }
  }

  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  loadApprovedItems() {
    this.facturacionService
      .getApprovedItems()
      .subscribe(res => {
        this.invoiceItems = res.data;
        this.recalculateInvoice();

      });
  }
  selectDetraccion(d: any) {
    this.detraccionTipo = d.codigo;
    this.detraccionSearch = `${d.codigo} - ${d.descripcion}`;
    this.showDetraccionDropdown = false;

    this.recalculateInvoice();
  }
  get filteredInvoiceItems(): any[] {
    let items = this.invoiceItems;

    if (this.showOnlyPendingInvoices) {
      items = items.filter(item => !item.invoiced);
    }

    const filtro = this.searchText?.trim().toLowerCase();

    if (!filtro) {
      return items;
    }

    return items.filter(item =>
      `${item?.intakeCode || ''} ${item?.description || ''}`.toLowerCase().includes(filtro)
    );
  }


  filterDetracciones() {
    const t = this.detraccionSearch.toLowerCase().trim();

    if (!t) {
      this.filteredDetracciones = this.detracciones;
      return;
    }

    this.filteredDetracciones = this.detracciones.filter(d =>
      d.descripcion.toLowerCase().includes(t) ||
      d.codigo.toString().includes(t)
    );
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

    const primero = this.invoiceItems.find(x => x.selected);
    console.log(primero)
    this.clienteInfoItem = primero
      ? { nombre: primero.clienteNombre, numero: primero.clienteNumero }
      : null;

    console.log('Items seleccionados:', this.itemsSeleccionados);
    const selected =
      this.invoiceItems.filter((x: any) => x.selected);

    this.subTotal =
      selected.reduce((a: any, b: any) => a + b.subTotal, 0);

    this.igv = this.subTotal * 0.18;
    this.total = this.subTotal + this.igv;

    if (this.applyDetraccion) {

      this.detraccionAmount =
        (this.total * this.detraccionPercent) / 100;

    } else {
      this.detraccionTipo = null;
      this.detraccionSearch = '';
      this.filteredDetracciones = [...this.detracciones];
      this.detraccionAmount = 0;

    }

    // TOTAL A PAGAR
    this.totalPagar =
      this.total - this.detraccionAmount;

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
        this.cli.documentIdentificationType = 'Ruc';
      }
      this.tipoClienteSeleccionado = tipo;
    }
  }

  consultarDocumento() {
    this.facturacionService.consultarDecolect(this.cli.documentIdentificationNumber, this.tipoClienteSeleccionado ? this.tipoClienteSeleccionado : '').subscribe(res => {
      console.log('Datos del cliente:', res);
    });
  }

  buscarClientePorDocumento() {
    const numeroDocumento = this.clientDocumentInput.trim();

    if (!numeroDocumento) {
      this.snackBar.open('Ingresa un DNI o RUC para buscar', '', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
      return;
    }

    let tipoDocumento = '';

    if (numeroDocumento.length === 8) {
      tipoDocumento = 'DNI';
    } else if (numeroDocumento.length === 11) {
      tipoDocumento = 'Ruc';
    } else {
      this.snackBar.open('El documento debe tener 8 dígitos para DNI o 11 para RUC', '', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.clientLookupLoading = true;

    this.clienteService.consultarDocumento(tipoDocumento, numeroDocumento).subscribe({
      next: (response: any) => {
        this.clientLookupLoading = false;

        if (response?.message === 'not found') {
          this.snackBar.open('No se encontraron datos para el documento proporcionado', '', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
          return;
        }

        const fullName = `${response?.first_name ?? ''} ${response?.first_last_name ?? ''}`.trim();
        const displayName = fullName || response?.razon_social || '';
        const address = response?.direccion || '';

        this.client = {
          name: displayName,
          document: numeroDocumento,
          address
        };

        this.venta.cliente = {
          documentIdentificationNumber: numeroDocumento,
          firstName: response?.first_name || response?.razon_social || displayName,
          lastName: response?.first_last_name || '',
          names: displayName,
          address
        };

        this.snackBar.open('Datos del cliente cargados correctamente', '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
      },
      error: () => {
        this.clientLookupLoading = false;
        this.snackBar.open('Error al consultar el documento', '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
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

  openMenu() {
    this.sidebarService.toggleSidenav();
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
      this.venta.tipoComprobante = '1';
      this.serie = 'F002';
    } else {
      this.venta.tipoComprobante = '2'
      this.serie = 'B002';
    }
  }

  imprimirVenta() {
    this.isLoading = true;

    const items =
      this.invoiceItems.filter(x => x.selected)
        .map(x => ({
          ...x,
          id: x.budgetItemId,
          code: x.intakeCode,
          description: x.description,
          value: x.subTotal,
          cantidad: x.quantity,
        }));
    const numeroDoc = this.venta.cliente?.documentIdentificationNumber || '';
    const tipoDocumento = numeroDoc.length === 8 ? "1" : "6";
    const nombreCliente = this.venta.cliente?.names
      || `${this.venta.cliente?.firstName || ''} ${this.venta.cliente?.lastName || ''}`.trim();
    console.log('Número de documento del cliente:', items);
    const resumenVenta = {
      items: items,
      direccion: this.venta.cliente?.address || '',
      observaciones: this.venta.observaciones || '',
      tipo_de_comprobante: this.venta.tipoComprobante,
      cliente_numero: this.venta.cliente?.documentIdentificationNumber || '',
      cliente_nombre: nombreCliente,
      serie: this.serie,
      cliente_tipo_documento: tipoDocumento,
      metodo_pago: 1,
      cond_venta: this.paymentCondition === 'CONTADO' ? 'CONTADO' : 'CREDITO',
      // 👇 NUEVO
      tipo_condicion_pago: this.paymentCondition === 'CREDITO_DIAS'
        ? `CREDITO_DIAS_${this.diasCredito}`
        : this.paymentCondition,

      cuotas: this.paymentCondition !== 'CONTADO'
        ? this.cuotasDetalle.map(c => ({
          cuota: c.cuota,
          fecha_pago: c.fecha,
          importe: c.importe
        }))
        : [],
      fecha_emision: this.fechaBoleteoHoy,
      detraccion: this.applyDetraccion,
      detraccion_tipo:
        this.applyDetraccion ? this.detraccionTipo : null,
      detraccion_porcentaje:
        this.applyDetraccion ? this.detraccionPercent : null,
      detraccion_total:
        this.applyDetraccion ? this.detraccionAmount : null
    };
    console.log(resumenVenta)
    this.facturacionService.registrarVenta(resumenVenta).subscribe(
      (res: any) => {
        this.isLoading = false;
        if (res.success) {
          this.resetFormVenta();
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
          this.loadVentas();

        } else {
          this.snackBar.open(res.message, '', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
        }
        this.loadApprovedItems();

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

  onToggleDetraccion() {
    if (this.applyDetraccion) {
      // 🔥 buscar la detracción con código 020
      const detraccion020 = this.detracciones.find((d: any) => d.codigo === 18);
      console.log("entre")
      if (detraccion020) {
        this.selectDetraccion(detraccion020);
      }
    } else {
      this.detraccionSearch = '';
    }

    this.recalculateInvoice();
  }

  resetFormVenta() {
    this.itemsSeleccionados = [];

    this.invoiceItems.forEach(x => x.selected = false);

    this.venta = {
      ...this.venta,
    };

    this.serie = '';
    this.fechaBoleteoHoy = new Date().toISOString().substring(0, 10);

    // 🔥 DETRACCIÓN
    this.applyDetraccion = false;
    this.detraccionTipo = null;
    this.detraccionPercent = 0;
    this.detraccionAmount = 0;
    this.detraccionSearch = '';
    this.filteredDetracciones = [...this.detracciones];
    this.showDetraccionDropdown = false;

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
