import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalPromocionesDialogComponent } from './modal-promociones-dialog/modal-promociones-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PromocionesService } from '../../../../../services/promociones.service';

@Component({
  selector: 'app-promociones',
  templateUrl: './promociones.component.html',
  styleUrl: './promociones.component.scss'
})
export class PromocionesComponent {

  promociones: any[] = [];
  filtroTexto: string = '';

  paginaActual = 1;
  filasPorPagina = 5;

  constructor(private dialog: MatDialog, private snackBar: MatSnackBar, private promocionService: PromocionesService) { }

  ngOnInit(): void {
    this.loadPromociones();
  }

  loadPromociones() {
    this.promocionService.getPromociones().subscribe({
      next: (data) => {
        this.promociones = data;
      }
    });
  }

  
  paginaAnterior() {
    if (this.paginaActual > 1) this.paginaActual--;
  }

  paginaSiguiente() {
    if (this.paginaActual * this.filasPorPagina < this.promociones.length) this.paginaActual++;
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(ModalPromocionesDialogComponent, {
      width: '1500px',
      panelClass: 'full-modal'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
         this.snackBar.open(result.message, '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
        this.loadPromociones();
      }
    });
  }

  openEditDialog(item: any) {
    const dialogRef = this.dialog.open(ModalPromocionesDialogComponent, {
      width: '1500px',
      data: item
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open(result.message, '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
        this.loadPromociones();
      }
    });
  }
}
