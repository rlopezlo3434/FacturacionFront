import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'serieFilter',
  standalone: false
})
export class SerieFilterPipe implements PipeTransform {
  transform(series: any[], tipoComprobante: string): any[] {
    if (!series || !tipoComprobante) return series || [];
    const tipo = tipoComprobante.toUpperCase();
    return series.filter(s => (s.tipo || '').toUpperCase().includes(tipo));
  }
}
