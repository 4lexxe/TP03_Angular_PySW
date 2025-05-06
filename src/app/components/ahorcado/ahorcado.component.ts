import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ahorcado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ahorcado.component.html',
  styleUrl: './ahorcado.component.css'
})
export class AhorcadoComponent implements OnChanges {
  @Input() intentosFallidos: number = 0;
  @Input() maxIntentos: number = 6;

  // Añadir una propiedad para forzar la visualización completa
  @Input() mostrarCompleto: boolean = false;

  // Umbrales para mostrar cada parte del cuerpo
  umbralCabeza: number = 1;
  umbralCuerpo: number = 2;
  umbralBrazoIzq: number = 3;
  umbralBrazoDer: number = 4;
  umbralPiernaIzq: number = 5;
  umbralPiernaDer: number = 6;

  // Verificar si el juego está perdido
  get estaPerdido(): boolean {
    return this.intentosFallidos >= this.maxIntentos || this.mostrarCompleto;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['maxIntentos']) {
      this.calcularUmbrales();
    }
  }

  // Calcula los umbrales basados en el número de intentos
  calcularUmbrales(): void {
    if (this.maxIntentos <= 6) {
      // Si hay menos o igual a 6 intentos, ajustamos los umbrales proporcionalmente
      this.umbralCabeza = Math.ceil(this.maxIntentos / 6);
      this.umbralCuerpo = Math.ceil((2 * this.maxIntentos) / 6);
      this.umbralBrazoIzq = Math.ceil((3 * this.maxIntentos) / 6);
      this.umbralBrazoDer = Math.ceil((4 * this.maxIntentos) / 6);
      this.umbralPiernaIzq = Math.ceil((5 * this.maxIntentos) / 6);
      this.umbralPiernaDer = this.maxIntentos;
    } else {
      // Si hay más de 6 intentos, distribuimos los umbrales equitativamente
      const paso = this.maxIntentos / 6;
      this.umbralCabeza = Math.ceil(paso);
      this.umbralCuerpo = Math.ceil(paso * 2);
      this.umbralBrazoIzq = Math.ceil(paso * 3);
      this.umbralBrazoDer = Math.ceil(paso * 4);
      this.umbralPiernaIzq = Math.ceil(paso * 5);
      this.umbralPiernaDer = this.maxIntentos;
    }
  }

  // Verifica si debe mostrarse la parte del cuerpo según los intentos fallidos
  mostrarParte(umbral: number): boolean {
    return this.intentosFallidos >= umbral || this.mostrarCompleto;
  }
}
