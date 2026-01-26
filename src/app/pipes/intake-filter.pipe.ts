import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'intakeFilter',
  standalone: true
})
export class IntakeFilterPipe implements PipeTransform {

   transform(list: any[], text: string): any[] {
    if (!list) return [];
    if (!text) return list;

    const t = text.toLowerCase();

    return list.filter(x => {
      const plate = (x.vehicle?.plate || '').toLowerCase();
      const client = (x.client?.names || '').toLowerCase();
      const mode = x.mode === 1 ? 'taller' : 'domicilio';

      return plate.includes(t) || client.includes(t) || mode.includes(t);
    });
  }

}
