import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'budgetFilter',
  standalone: true
})
export class BudgetFilterPipe implements PipeTransform {

  transform(list: any[], text: string): any[] {
    if (!list) return [];
    if (!text) return list;

    const t = text.toLowerCase();
    return list.filter(x => (x.code || '').toLowerCase().includes(t));
  }

}
