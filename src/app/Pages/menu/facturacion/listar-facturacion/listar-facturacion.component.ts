import { Component } from '@angular/core';
import { FacturacionService } from '../../../../../services/facturacion.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SidebarService } from '../../../../../services/sidebar.service';

@Component({
  selector: 'app-listar-facturacion',
  templateUrl: './listar-facturacion.component.html',
  styleUrl: './listar-facturacion.component.scss'
})
export class ListarFacturacionComponent {
  invoices: any[] = [];
  searchText = '';
  filtroTipo = 'TODOS';
  fecha: string;

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

  constructor(
    private facturaService: FacturacionService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private sidebarService: SidebarService
  ) {
    const hoy = new Date();
    this.fecha = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
  }

  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices() {
    this.facturaService.listarVentas(this.fecha).subscribe({
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
