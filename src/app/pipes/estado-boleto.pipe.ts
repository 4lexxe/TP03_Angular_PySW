import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estadoBoleto',
  standalone: true
})
export class EstadoBoletoPipe implements PipeTransform {
  transform(fechaCompra: Date): string {
    const ahora = new Date();
    const fechaCompraDate = new Date(fechaCompra);

    // Calcular la diferencia en días
    const diferenciaTiempo = ahora.getTime() - fechaCompraDate.getTime();
    const diferenciaDias = Math.floor(diferenciaTiempo / (1000 * 3600 * 24));

    if (diferenciaDias < 1) {
      return 'Reciente';
    } else if (diferenciaDias < 7) {
      return 'Esta semana';
    } else if (diferenciaDias < 30) {
      return 'Este mes';
    } else {
      return 'Anterior';
    }
  }
}
