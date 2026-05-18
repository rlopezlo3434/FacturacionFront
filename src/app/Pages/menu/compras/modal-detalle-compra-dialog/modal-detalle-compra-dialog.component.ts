import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ComprasService } from '../../../../../services/compras.service';

@Component({
  selector: 'app-modal-detalle-compra-dialog',
  templateUrl: './modal-detalle-compra-dialog.component.html',
  styleUrl: './modal-detalle-compra-dialog.component.scss'
})
export class ModalDetalleCompraDialogComponent implements OnInit {
  compra: any = null;
  isLoading = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id: number },
    private dialogRef: MatDialogRef<ModalDetalleCompraDialogComponent>,
    private comprasService: ComprasService
  ) {}

  ngOnInit() {
    this.comprasService.getById(this.data.id).subscribe({
      next: (res: any) => { this.compra = res.data; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  get currencyCode() { return this.compra?.moneda === 'DOLARES' ? 'USD' : 'PEN'; }

  cerrar() { this.dialogRef.close(); }
}
