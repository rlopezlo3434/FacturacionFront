import { Component, OnInit } from '@angular/core';
import { CajaService } from '../../../../../services/caja.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-caja',
  templateUrl: './caja.component.html',
  styleUrl: './caja.component.scss'
})
export class CajaComponent implements OnInit {

  monto: number = 0;
  cajas: any[] = [];
  verMovimientos: boolean = false;
  agregarMovimiento: boolean = false;
  motivoMovimiento: string = '';
  movs: any[] = [];
  tipoMovimiento: string = '';
  montoMovimiento: number = 0;
  cajaAbiertaMovimientoId: number | null = null;
  cerrarCajaId: number | null = null;
  efectivoContado: number = 0;
  observacionesCierre: string = '';
  fechaHoy: string = new Date().toISOString().substring(0, 10);

  constructor(private cajaService: CajaService, private snackBar: MatSnackBar,
  ) {

  }

  ngOnInit(): void {
    this.listarCajas();
  }

  toggleMovimiento(cajaId: number) {
    this.cajaAbiertaMovimientoId =
      this.cajaAbiertaMovimientoId === cajaId ? null : cajaId;
  }
  toggleCerrarCaja(cajaId: number) {
    this.cerrarCajaId =
      this.cerrarCajaId === cajaId ? null : cajaId;
  }

  abrirCaja() {
    this.cajaService.abriCaja(this.monto).subscribe(response => {
      console.log('Caja abierta:', response);
      this.snackBar.open('Caja abierta exitosamente', '', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['success-snackbar']
      });
      this.monto = 0;
      this.listarCajas();
    }, error => {
      console.error('Error al abrir la caja:', error);
    });
  }

  listarCajas() {
    this.cajaService.listaCajas().subscribe((cajas: any) => {
      this.cajas = cajas;
      console.log('Cajas abiertas:', cajas);
    }, error => {
      console.error('Error al listar las cajas:', error);
    });
  }

  verMovimientosCaja(cajaId: number) {
    this.verMovimientos = true;
    this.cajaService.verMovimientosCaja(cajaId).subscribe((movs: any) => {
      this.movs = movs.movimientos;
      console.log('Movimientos de la caja:', movs);
    }, error => {
      console.error('Error al obtener los movimientos de la caja:', error);
    });
  }

  addMovimiento() {
    const params = {
      CajaAperturaId: this.cajaAbiertaMovimientoId,
      Tipo: this.tipoMovimiento,
      Monto: this.montoMovimiento,
      Motivo: this.motivoMovimiento
    }

    this.cajaService.addMovimientoCaja(params).subscribe((response: any) => {
      console.log('Movimiento agregado:', response);
      this.montoMovimiento = 0;
      this.motivoMovimiento = '';
      this.tipoMovimiento = '';
      this.cajaAbiertaMovimientoId = null;
      this.listarCajas();

    }, (error: any) => {
      console.error('Error al agregar el movimiento:', error);
    });

  }

  cerrarCaja(cajaId: number) {
    // Lógica para cerrar la caja
    console.log('Cerrar caja con ID:', cajaId);
    const params = {
      cajaAperturaId: cajaId,
      efectivoContado: this.efectivoContado,
      observaciones: this.observacionesCierre
    }
    this.cajaService.cerrarCaja(params).subscribe((response: any) => {
      console.log('Caja cerrada:', response);
      this.efectivoContado = 0;
      this.observacionesCierre = '';
      this.cerrarCajaId = null;
      this.listarCajas();
      this.snackBar.open('Caja cerrada exitosamente', '', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
    }, (error: any) => {
      console.error('Error al cerrar la caja:', error);
    });
  }

  cajaDiario() {

    this.cajaService.cajaDiario(this.cajas[0].id, this.fechaHoy).subscribe(blob => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = `caja_diario_${this.fechaHoy}.xlsx`;
      a.click();
      URL.revokeObjectURL(objectUrl);
    });
  }

  reporteCajaMensual() {
    this.cajaService.reporteCajaMensual(this.fechaHoy).subscribe(blob => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = `reporte_caja_mensual_${this.fechaHoy}.xlsx`;
      a.click();
      URL.revokeObjectURL(objectUrl);
    });
  }
}