import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroCliente',
  standalone: false
})
export class FiltroClientePipe implements PipeTransform {

  transform(clientes: any[], texto: string, estado: string, genero: string): any[] {
    if (!clientes) return [];
    if (!texto && !estado && !genero) return clientes;

    texto = texto.toLowerCase();

    return clientes.filter(item => {
      const matchesTexto = item.names.toLowerCase().includes(texto) || item.documentIdentificationNumber.toString().includes(texto);
      const matchesEstado = estado ? item.isActive === (estado === 'true') : true;
      const matchesGenero = genero ? item.gender === genero : true;
      const matchesTipo = true; // No hay filtro por tipo en clientes, siempre es true
      return matchesTexto && matchesEstado && matchesGenero && matchesTipo;
    });
  }

}
