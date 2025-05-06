import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-selector-intentos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './selector-intentos.component.html',
  styleUrl: './selector-intentos.component.css'
})
export class SelectorIntentosComponent {
  @Output() intentosSeleccionados = new EventEmitter<number>();

  intentosOpciones: number[] = [3, 4, 5, 6, 7, 8, 9, 10];
  intentosSeleccionado: number = 6; // Valor por defecto

  // Emitir el evento con el nuevo valor seleccionado
  cambiarIntentos(): void {
    this.intentosSeleccionados.emit(this.intentosSeleccionado);
  }

  // Generar un número aleatorio de intentos (entre 3 y 10)
  generarIntentosAleatorios(): void {
    this.intentosSeleccionado = Math.floor(Math.random() * 8) + 3; // Números entre 3 y 10
    this.cambiarIntentos();
  }
}
