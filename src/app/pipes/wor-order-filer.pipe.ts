import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'worOrderFiler',
  standalone: true
})
export class WorOrderFilerPipe implements PipeTransform {

  transform(list: any[], search: string): any[] {
    if (!list) return [];
    if (!search) return list;

    const t = search.toLowerCase();

    return list.filter(x =>
      (x.code || '').toLowerCase().includes(t) ||
      (x.vehicle?.plate || '').toLowerCase().includes(t) ||
      (x.client?.names || '').toLowerCase().includes(t)
    );
  }

}
