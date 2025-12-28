import { Component, Inject } from '@angular/core';
import { PromocionesService } from '../../../../../../services/promociones.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-promociones-dialog',
  templateUrl: './modal-promociones-dialog.component.html',
  styleUrl: './modal-promociones-dialog.component.scss'
})
export class ModalPromocionesDialogComponent {
  promo: any = {
    name: '',
    code: '',
    startDate: '',
    endDate: '',
    isActive: true
  };

  isEdit = false;


  constructor(
    private dialogRef: MatDialogRef<ModalPromocionesDialogComponent>,
    private promotionService: PromocionesService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data)
    if (data) {
      this.promo = {
        ...data,
        startDate: data.startDate ? data.startDate.split('T')[0] : '',
        endDate: data.endDate ? data.endDate.split('T')[0] : ''
      };
      this.isEdit = true;
    }
  }

  save() {
    if (this.isEdit) {
      this.promotionService.updatePromocion(this.promo.id, this.promo).subscribe({
        next: (res) => this.dialogRef.close(res),
        error: (err) => console.error('Error actualizando promoción', err)
      });
    } else {
      this.promotionService.createPromocion(this.promo).subscribe({
        next: (res) => this.dialogRef.close(res),
        error: (err) => console.error('Error creando promoción', err)
      });
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
