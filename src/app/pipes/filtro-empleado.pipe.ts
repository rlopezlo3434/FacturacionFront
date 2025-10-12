import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroEmpleado',
  standalone: false
})
export class FiltroEmpleadoPipe implements PipeTransform {

   transform(empleados: any[], texto: string, estado: string): any[] {
    if (!empleados) return [];

    let resultado = empleados;

    //  Filtro por texto (nombre, apellido, documento o usuario)
    if (texto) {
      const lower = texto.toLowerCase();
      resultado = resultado.filter(emp =>
        emp.name?.toLowerCase().includes(lower) ||
        emp.lastName?.toLowerCase().includes(lower) ||
        emp.documentNumber?.toString().includes(lower) ||
        emp.username?.toLowerCase().includes(lower)
      );
    }

    //  Filtro por estado (activo/suspendido)
    if (estado !== '' && estado != null) {
      const estadoBool = (estado === 'true'); 
      resultado = resultado.filter(emp => emp.isActive === estadoBool);
    }

    return resultado;
  }

}
