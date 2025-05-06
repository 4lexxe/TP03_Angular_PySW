import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AhorcadoComponent } from '../ahorcado/ahorcado.component';
import { SelectorIntentosComponent } from '../selector-intentos/selector-intentos.component';
import { ConfetiComponent } from '../confeti/confeti.component';

@Component({
  selector: 'app-punto3',
  standalone: true,
  imports: [CommonModule, AhorcadoComponent, SelectorIntentosComponent, ConfetiComponent],
  templateUrl: './punto3.component.html',
  styleUrl: './punto3.component.css'
})
export class Punto3Component implements OnInit {
  // Determinar si estamos en el navegador o en el servidor
  // Cambiado de private a public para que sea accesible desde la plantilla
  public isBrowser: boolean;

  // Categoría de las palabras
  categoria: string = 'Animales';

  // Banco de 10 palabras
  palabras: string[] = [
    'elefante',
    'tigre',
    'jirafa',
    'rinoceronte',
    'pinguino',
    'ballena',
    'cocodrilo',
    'leopardo',
    'camaleon',
    'cangrejo'
  ];

  // Palabra seleccionada para el juego actual
  palabraSeleccionada: string = '';

  // Estado actual de la palabra con guiones bajos
  palabraActual: string[] = [];

  // Letras ya utilizadas
  letrasUsadas: string[] = [];

  // Número de intentos fallidos
  intentosFallidos: number = 0;

  // Número máximo de intentos permitidos
  maxIntentos: number = 6;

  // Estado del juego
  juegoTerminado: boolean = false;
  juegoGanado: boolean = false;

  // Alfabeto para generar los botones de letras
  alfabeto: string[] = 'abcdefghijklmnopqrstuvwxyz'.split('');

  // Mostrar u ocultar modal
  mostrarModal: boolean = false;

  // Indica si el juego ya ha comenzado
  juegoComenzado: boolean = false;

  // Propiedad para controlar el efecto de confeti
  mostrarConfeti: boolean = false;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    // Ahora no iniciamos el juego automáticamente, esperamos a que se seleccionen los intentos
  }

  // Manejar el cambio de intentos
  cambiarIntentos(intentos: number): void {
    this.maxIntentos = intentos;

    // Si el juego ya había comenzado, reiniciarlo con los nuevos intentos
    if (this.juegoComenzado) {
      this.reiniciar();
    } else {
      this.iniciarJuego();
    }
  }

  // Iniciar un nuevo juego
  iniciarJuego(): void {
    // Seleccionar una palabra al azar
    this.palabraSeleccionada = this.palabras[Math.floor(Math.random() * this.palabras.length)];

    // Inicializar la palabra actual con guiones
    this.palabraActual = Array(this.palabraSeleccionada.length).fill('_');

    // Resetear variables
    this.letrasUsadas = [];
    this.intentosFallidos = 0;
    this.juegoTerminado = false;
    this.juegoGanado = false;
    this.mostrarModal = false;
    this.juegoComenzado = true;
  }

  // Procesar intento con una letra
  intentarLetra(letra: string): void {
    // Si el juego terminó o la letra ya fue usada, no hacer nada
    if (this.juegoTerminado || this.letrasUsadas.includes(letra)) {
      return;
    }

    // Agregar la letra a las letras usadas
    this.letrasUsadas.push(letra);

    // Verificar si la letra está en la palabra
    if (this.palabraSeleccionada.includes(letra)) {
      // Actualizar la palabra actual con la letra
      for (let i = 0; i < this.palabraSeleccionada.length; i++) {
        if (this.palabraSeleccionada[i] === letra) {
          this.palabraActual[i] = letra;
        }
      }

      // Verificar si se ganó el juego
      if (!this.palabraActual.includes('_')) {
        this.juegoGanado = true;
        this.juegoTerminado = true;

        // Activar el efecto de confeti al ganar solo si estamos en un navegador
        if (this.isBrowser) {
          this.mostrarConfeti = true;
        }
      }
    } else {
      // Incrementar intentos fallidos
      this.intentosFallidos++;

      // Verificar si se perdió el juego
      if (this.intentosFallidos >= this.maxIntentos) {
        this.juegoTerminado = true;
        this.mostrarModalPerdiste();
      }
    }
  }

  // Método para manejar cuando termina la animación del confeti
  onConfetiFinished(): void {
    this.mostrarConfeti = false;
  }

  // Mostrar el modal de pérdida (simplemente actualiza una variable)
  mostrarModalPerdiste(): void {
    this.mostrarModal = true;
  }

  // Ocultar el modal
  ocultarModal(): void {
    this.mostrarModal = false;
  }

  // Reiniciar el juego
  reiniciar(): void {
    this.mostrarConfeti = false;
    this.iniciarJuego();
  }
}
