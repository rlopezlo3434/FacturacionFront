import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroVehiculo',
  standalone: true
})
export class FiltroVehiculoPipe implements PipeTransform {

  transform(vehiculos: any[], texto: string): any[] {
    if (!vehiculos) return [];
    if (!texto) return vehiculos;

    const t = texto.toLowerCase();

    return vehiculos.filter(v => {
      const plate = (v.plate || '').toLowerCase();
      const owner = (v.owner?.name || '').toLowerCase();
      const model = (v.model?.name || '').toLowerCase();
      const brand = (v.brand?.name || '').toLowerCase();

      return plate.includes(t) || owner.includes(t) || model.includes(t) || brand.includes(t);
    });
  }

}
