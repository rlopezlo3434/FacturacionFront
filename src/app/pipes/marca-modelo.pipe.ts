import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'marcaModelo',
  standalone: true
})
export class MarcaModeloPipe implements PipeTransform {

  transform(value: any[] | null | undefined, searchText: string): any[] {
    if (!value) {
      return [];
    }

    if (!searchText?.trim()) {
      return value;
    }

    const filtro = searchText.trim().toLowerCase();

    return value.filter(item =>
      (item?.name || '').toLowerCase().includes(filtro)
    );
  }

}
