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
  searchText: string = '';

  paginaActual = 1;
  filasPorPagina = 50;

  totalFacturado = 0;
  facturasPendientes = 0;
  fecha: string = new Date().toISOString().split('T')[0];
  constructor(
    private facturaService: FacturacionService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private sidebarService: SidebarService
  ) { }

  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices() {

    this.facturaService.listarVentas(this.fecha).subscribe({
      next: (data: any) => {

        this.invoices = data;

        this.calcularKpis();

      },
      error: () => {

        this.snackBar.open('Error al cargar facturas', '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });

      }
    });

  }

  generarFactura(inv: any){
    this.facturaService.getFacturaPDF(inv.id).subscribe({
      next: (pdfData: Blob) => {
        const url = window.URL.createObjectURL(pdfData);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Factura_${inv.id}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err: any) => {
        this.snackBar.open(err.error?.message || 'No se pudo descargar el PDF.', '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  calcularKpis() {

    this.totalFacturado = this.invoices
      .reduce((sum, x) => sum + (x.total || 0), 0);

    this.facturasPendientes = this.invoices
      .filter(x => x.estado === 'Pendiente')
      .length;

  }

  openMenu() {
    this.sidebarService.toggleSidenav();
  }

  openCreateInvoice() {

    // const dialogRef = this.dialog.open(ModalFacturaComponent, {
    //   width: '1200px',
    //   maxWidth: '90vw'
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if(result){
    //     this.loadInvoices();
    //   }
    // });

  }

  verFactura(invoice: any) {

    // const dialogRef = this.dialog.open(ModalFacturaViewComponent,{
    //   width:'1200px',
    //   data:invoice
    // });

  }

  paginaAnterior() {

    if (this.paginaActual > 1)
      this.paginaActual--;

  }

  paginaSiguiente() {

    if (this.paginaActual * this.filasPorPagina < this.invoices.length)
      this.paginaActual++;

  }

}
