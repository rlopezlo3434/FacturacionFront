import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroItem',
  standalone: false
})
export class FiltroItemPipe implements PipeTransform {

  transform(items: any[], texto: string, estado: string, tipo: string): any[] {
    if (!items) return [];
    let resultado = items;

    //  Filtro por texto (nombre)
    if (texto) {
      const lower = texto.toLowerCase();
      resultado = resultado.filter(emp =>
        emp.description?.toLowerCase().includes(lower) 
      );
    }

    //  Filtro por estado (activo/suspendido)
    if (estado !== '' && estado != null) {
      const estadoBool = (estado === 'true');
      resultado = resultado.filter(emp => emp.isActive === estadoBool);
    }

    //  Filtro por tipo (producto/servicio)
    if (tipo !== '' && tipo != null) {
      resultado = resultado.filter(emp => emp.item === tipo);
    }

    return resultado;
  }
}
