import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'serviceFilter',
  standalone: true
})
export class ServiceFilterPipe implements PipeTransform {

  transform(list: any[], text: string): any[] {
    if (!list) return [];
    if (!text) return list;

    const t = text.toLowerCase();

    return list.filter(x => {
      const code = (x.code || '').toLowerCase();
      const name = (x.name || '').toLowerCase();

      return code.includes(t) || name.includes(t);
    });
  }

}
