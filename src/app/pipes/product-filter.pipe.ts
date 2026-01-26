import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'productFilter',
  standalone: true
})
export class ProductFilterPipe implements PipeTransform {

  transform(list: any[], text: string): any[] {
    if (!list) return [];
    if (!text) return list;

    const t = text.toLowerCase();

    return list.filter(x => {
      const code = (x.code || '').toLowerCase();
      const name = (x.name || '').toLowerCase();
      const serial = (x.serialCode || '').toLowerCase();
      const brand = (x.brand?.name || '').toLowerCase();

      return code.includes(t) || name.includes(t) || serial.includes(t) || brand.includes(t);
    });
  }

}
