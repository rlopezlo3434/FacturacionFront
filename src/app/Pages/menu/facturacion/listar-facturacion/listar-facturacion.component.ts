import { Component } from '@angular/core';
import { FacturacionService } from '../../../../../services/facturacion.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SidebarService } from '../../../../../services/sidebar.service';
import { ModalNotaCreditoDialogComponent } from '../modal-nota-credito-dialog/modal-nota-credito-dialog.component';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-listar-facturacion',
  templateUrl: './listar-facturacion.component.html',
  styleUrl: './listar-facturacion.component.scss',
  animations: [
    trigger('collapseExpand', [
      transition(':enter', [
        style({ height: 0, opacity: 0, overflow: 'hidden' }),
        animate('220ms cubic-bezier(0.4, 0, 0.2, 1)', style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ overflow: 'hidden' }),
        animate('180ms cubic-bezier(0.4, 0, 0.2, 1)', style({ height: 0, opacity: 0 }))
      ])
    ])
  ]
})
export class ListarFacturacionComponent {
  invoices: any[] = [];
  searchText = '';
  filtroTipo = 'TODOS';
  fecha: string;
  desde: string;
  hasta: string | null = null;

  paginaActual = 1;
  filasPorPagina = 20;

  totalFacturado = 0;
  facturasPendientes = 0;

  readonly tiposFiltro = [
    { label: 'Todos',    value: 'TODOS' },
    { label: 'Facturas', value: 'FACTURA' },
    { label: 'Boletas',  value: 'BOLETA' },
    { label: 'N/C',      value: 'NOTA DE CREDITO' },
    // { label: 'N/D',      value: 'NOTA DE DEBITO' },
  ];

  // ===== DOCUMENTOS PENDIENTES DE ENVÍO =====
  establishmentId: number | null = null;
  mostrarPendientes = false;
  cargandoPendientes = false;
  enviandoPendientes = false;
  pendientes: any[] = [];

  constructor(
    private facturaService: FacturacionService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private sidebarService: SidebarService
  ) {
    const hoy = new Date();
    this.fecha = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
    this.desde = this.fecha;

    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    this.establishmentId = user?.establishment?.id ?? null;
  }

  ngOnInit(): void {
    this.loadInvoices();
    this.dispararEnvioPendientesDelDia();
  }

  // Se ejecuta al abrir el sistema: despacha lo que ya cumplió su fecha programada
  // (boletas del día anterior, facturas pendientes, etc.)
  dispararEnvioPendientesDelDia() {
    if (!this.establishmentId) return;
    this.facturaService.enviarPendientes(this.establishmentId).subscribe({
      next: () => this.loadInvoices(),
      error: () => { /* silencioso: no interrumpir el ingreso al sistema */ }
    });
  }

  loadInvoices() {
    this.facturaService.listarVentas(this.desde, this.hasta ?? undefined).subscribe({
      next: (data: any) => {
        this.invoices = data;
        this.paginaActual = 1;
        this.calcularKpis();
      },
      error: () => {
        this.snackBar.open('Error al cargar facturas', '', {
          duration: 3000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar']
        });
      }
    });
  }

  get invoicesFiltrados(): any[] {
    let lista = this.invoices;

    if (this.filtroTipo !== 'TODOS') {
      lista = lista.filter(inv => {
        const t = inv.tipoComprobante?.toUpperCase() ?? '';
        if (this.filtroTipo === 'FACTURA') return t.includes('FACTURA');
        if (this.filtroTipo === 'BOLETA')  return t.includes('BOLETA');
        return t === this.filtroTipo;
      });
    }

    if (this.searchText.trim()) {
      const q = this.searchText.toLowerCase();
      lista = lista.filter(inv =>
        inv.clienteNombre?.toLowerCase().includes(q) ||
        inv.clienteNumero?.toLowerCase().includes(q) ||
        String(inv.numero).includes(q) ||
        inv.serie?.toLowerCase().includes(q)
      );
    }

    return lista;
  }

  get totalPaginas(): number {
    return Math.ceil(this.invoicesFiltrados.length / this.filasPorPagina) || 1;
  }

  get invoicesPaginados(): any[] {
    const start = (this.paginaActual - 1) * this.filasPorPagina;
    return this.invoicesFiltrados.slice(start, start + this.filasPorPagina);
  }

  setFiltroTipo(tipo: string) {
    this.filtroTipo = tipo;
    this.paginaActual = 1;
  }

  paginaAnterior() {
    if (this.paginaActual > 1) this.paginaActual--;
  }

  paginaSiguiente() {
    if (this.paginaActual < this.totalPaginas) this.paginaActual++;
  }

  getTipoLabel(tipo: string): string {
    switch (tipo?.toUpperCase()) {
      case 'FACTURA':
      case 'FACTURA_ELECTRONICA': return 'Factura';
      case 'BOLETA':
      case 'BOLETA_ELECTRONICA': return 'Boleta';
      case 'NOTA DE CREDITO':
      case 'NOTA_CREDITO': return 'N/C';
      case 'NOTA DE DEBITO':
      case 'NOTA_DEBITO': return 'N/D';
      default: return tipo ?? '—';
    }
  }

  getTipoClass(tipo: string): string {
    switch (tipo?.toUpperCase()) {
      case 'FACTURA':
      case 'FACTURA_ELECTRONICA': return 'chip-factura';
      case 'BOLETA':
      case 'BOLETA_ELECTRONICA': return 'chip-boleta';
      case 'NOTA DE CREDITO':
      case 'NOTA_CREDITO': return 'chip-nc';
      case 'NOTA DE DEBITO':
      case 'NOTA_DEBITO': return 'chip-nd';
      default: return '';
    }
  }

  esFacturaOBoleta(tipo: string): boolean {
    const t = tipo?.toUpperCase() ?? '';
    return t.includes('FACTURA') || t.includes('BOLETA');
  }

  emitirNotaCredito(inv: any) {
    inv.emitiendoNC = true;
    this.facturaService.emitirNotaCredito(inv.id).subscribe({
      next: (res: any) => {
        inv.emitiendoNC = false;
        this.snackBar.open(res?.message || 'Nota de crédito emitida', '', {
          duration: 3000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['success-snackbar']
        });
        this.loadInvoices();
      },
      error: (err: any) => {
        inv.emitiendoNC = false;
        this.snackBar.open(err?.error?.message || 'Error al emitir nota de crédito', '', {
          duration: 3000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar']
        });
      }
    });
  }

  // ===== NUEVO FLUJO: encolar NC / anulación (procesadas por el job de pendientes) =====
  generarNotaCredito(inv: any) {
    if (inv.encolando) return;

    const dialogRef = this.dialog.open(ModalNotaCreditoDialogComponent, {
      width: '420px',
      data: { serie: inv.serie, numero: inv.numero }
    });

    dialogRef.afterClosed().subscribe((result: { confirmed: boolean; reemplazadoPor: string | null } | undefined) => {
      if (!result?.confirmed) return;

      inv.encolando = true;
      this.facturaService.encolarNotaCredito(inv.id, result.reemplazadoPor ?? undefined).subscribe({
        next: (res: any) => {
          inv.encolando = false;
          this.snackBar.open(res?.message || 'Nota de crédito encolada para su envío.', '', {
            duration: 4000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['success-snackbar']
          });
          this.loadInvoices();
          if (this.mostrarPendientes) this.cargarPendientes();
        },
        error: (err: any) => {
          inv.encolando = false;
          const mensaje = err?.error?.error || err?.error?.message || 'No se pudo encolar la Nota de Crédito.';
          this.snackBar.open(mensaje, '', {
            duration: 4000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar']
          });
        }
      });
    });
  }

  anularComprobante(inv: any) {
    if (inv.encolando) return;

    inv.encolando = true;
    this.facturaService.encolarAnulacion(inv.id).subscribe({
      next: (res: any) => {
        inv.encolando = false;
        this.snackBar.open(res?.message || 'Anulación encolada para su envío.', '', {
          duration: 4000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['success-snackbar']
        });
        this.loadInvoices();
        if (this.mostrarPendientes) this.cargarPendientes();
      },
      error: (err: any) => {
        inv.encolando = false;
        const mensaje = err?.error?.error || err?.error?.message || 'No se pudo encolar la anulación.';
        this.snackBar.open(mensaje, '', {
          duration: 4000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar']
        });
      }
    });
  }

  // ===== PANEL DE PENDIENTES =====
  togglePendientes() {
    this.mostrarPendientes = !this.mostrarPendientes;
    if (this.mostrarPendientes) this.cargarPendientes();
  }

  cargarPendientes() {
    if (!this.establishmentId) return;

    this.cargandoPendientes = true;
    this.facturaService.getPendientes(this.establishmentId).subscribe({
      next: (res: any) => {
        this.cargandoPendientes = false;
        this.pendientes = res?.data || res || [];
      },
      error: () => {
        this.cargandoPendientes = false;
        this.snackBar.open('No se pudo cargar los documentos pendientes.', '', {
          duration: 3000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar']
        });
      }
    });
  }

  enviarPendientesAhora() {
    if (!this.establishmentId || this.enviandoPendientes) return;

    this.enviandoPendientes = true;
    this.facturaService.enviarPendientes(this.establishmentId).subscribe({
      next: (res: any) => {
        this.enviandoPendientes = false;
        this.snackBar.open(res?.message || 'Documentos pendientes procesados.', '', {
          duration: 3000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['success-snackbar']
        });
        this.cargarPendientes();
        this.loadInvoices();
      },
      error: (err: any) => {
        this.enviandoPendientes = false;
        this.snackBar.open(err?.error?.message || 'Error al enviar pendientes.', '', {
          duration: 3000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar']
        });
      }
    });
  }

  reintentarPendiente(doc: any) {
    if (doc.reintentando) return;

    doc.reintentando = true;
    this.facturaService.reintentarPendiente(doc.id).subscribe({
      next: (res: any) => {
        doc.reintentando = false;
        this.snackBar.open(res?.message || 'Documento reintentado.', '', {
          duration: 3000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['success-snackbar']
        });
        this.cargarPendientes();
        this.loadInvoices();
      },
      error: (err: any) => {
        doc.reintentando = false;
        this.snackBar.open(err?.error?.message || 'No se pudo reintentar el documento.', '', {
          duration: 3000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar']
        });
      }
    });
  }

  verPdfPendiente(doc: any) {
    const ventaId = doc.ventaOriginalId;
    this.facturaService.getPdfNotaCredito(ventaId).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
      },
      error: () => {
        this.snackBar.open('No se pudo obtener el PDF.', '', {
          duration: 3000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar']
        });
      }
    });
  }

  getEstadoClass(estado: string): string {
    switch (estado?.toUpperCase()) {
      case 'ENVIADO': return 'chip-vigente';
      case 'ERROR': return 'chip-anulado';
      default: return 'chip-pendiente';
    }
  }

  generarFactura(inv: any) {
    this.facturaService.getFacturaPDF(inv.id).subscribe({
      next: (pdfData: Blob) => {
        const url = window.URL.createObjectURL(pdfData);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${inv.tipoComprobante}-${inv.serie}-${inv.numero}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err: any) => {
        this.snackBar.open(err.error?.message || 'No se pudo descargar el PDF.', '', {
          duration: 3000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar']
        });
      }
    });
  }

  descargarReporte() {
    this.facturaService.obtenerProductividad2(this.fecha).subscribe(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Reporte_Ventas.xlsx';
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  descargarXML(url: string) {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  calcularKpis() {
    this.totalFacturado = this.invoices.reduce((sum, x) => sum + (x.total || 0), 0);
    this.facturasPendientes = this.invoices.filter(x => x.estado === 'Pendiente').length;
  }

  openMenu() {
    this.sidebarService.toggleSidenav();
  }

  openCreateInvoice() { }
  verFactura(invoice: any) { }
}
