import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroPromocio',
  standalone: false
})
export class FiltroPromocioPipe implements PipeTransform {

  transform(promociones: any[], texto: string): any[] {
    if (!promociones) return [];

    let resultado = promociones;
    console.log(promociones);
    if (texto) {
      const lower = texto.toLowerCase();
      resultado = resultado.filter(emp =>
        emp.name?.toLowerCase().includes(lower) 
      );
    }

    //  Filtro por estado (activo/suspendido)
    // if (estado !== '' && estado != null) {
    //   const estadoBool = (estado === 'true');
    //   resultado = resultado.filter(emp => emp.isActive === estadoBool);
    // }

    return resultado;
  }

}
