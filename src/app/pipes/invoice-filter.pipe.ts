import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'invoiceFilter',
  standalone: true
})
export class InvoiceFilterPipe implements PipeTransform {

  transform(items: any[], searchText: string): any[] {

    if (!items || !searchText)
      return items;

    const term = searchText.toLowerCase();

    return items.filter(x =>
      (x.intakeCode?.toLowerCase().includes(term)) ||
      (x.budgetCode?.toLowerCase().includes(term)) ||
      (x.description?.toLowerCase().includes(term))
    );
  }

}
