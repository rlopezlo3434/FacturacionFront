import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroProveedores',
  standalone: true
})
export class FiltroProveedoresPipe implements PipeTransform {

  transform(proveedores: any[], texto: string): any[] {
    if (!proveedores) return [];
    if (!texto) return proveedores;

    texto = texto.toLowerCase();

    return proveedores.filter(item => {
      const matchesTexto = item.razonSocial.toLowerCase().includes(texto) || item.ruc.toString().includes(texto);
      return matchesTexto;
    });
  }

}
