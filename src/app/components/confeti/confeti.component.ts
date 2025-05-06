import { Component, Input, OnInit, OnDestroy, ElementRef, NgZone, Output, EventEmitter, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

interface Particula {
  x: number;
  y: number;
  velocidadY: number;
  radio: number;
  color: string;
  rotacion: number;
  velocidadRotacion: number;
  forma: 'circulo' | 'cuadrado' | 'rectangulo' | 'triangulo';
}

@Component({
  selector: 'app-confeti',
  standalone: true,
  imports: [CommonModule],
  template: '<canvas #canvas class="confeti-canvas" [class.fade-out]="fadeOut"></canvas>',
  styles: [`
    .confeti-canvas {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
      opacity: 1;
      transition: opacity 0.5s ease;
    }

    .fade-out {
      opacity: 0;
    }
  `]
})
export class ConfetiComponent implements OnInit, OnDestroy {
  @Input() activo: boolean = false;
  @Input() duracion: number = 5000; // Duración en milisegundos
  @Input() densidad: number = 100; // Cantidad de partículas
  @Output() finAnimacion = new EventEmitter<void>();

  fadeOut: boolean = false;
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private animacionId: number = 0;
  private particulas: Particula[] = [];
  private colores: string[] = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff8800', '#8800ff'];
  private formas: Array<'circulo' | 'cuadrado' | 'rectangulo' | 'triangulo'> = ['circulo', 'cuadrado', 'rectangulo', 'triangulo'];
  private tiempoInicio: number = 0;
  private timerFinalizacion: any = null;
  private isBrowser: boolean;

  constructor(
    private el: ElementRef,
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;

    this.canvas = this.el.nativeElement.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;

    // Configurar tamaño del canvas
    this.ajustarTamanoCanvas();

    // Escuchar cambios en el tamaño de la ventana
    if (this.isBrowser) {
      window.addEventListener('resize', this.ajustarTamanoCanvas.bind(this));
    }

    // Iniciar la animación si está activo
    if (this.activo) {
      this.iniciarEfecto();
      this.programarFinalizacion();
    }
  }

  ngOnChanges(): void {
    if (!this.isBrowser) return;

    if (this.activo) {
      this.fadeOut = false;
      this.iniciarEfecto();
      this.programarFinalizacion();
    } else {
      this.detenerEfecto();
    }
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;

    if (window) {
      window.removeEventListener('resize', this.ajustarTamanoCanvas.bind(this));
    }
    this.detenerEfecto();
    if (this.timerFinalizacion) {
      clearTimeout(this.timerFinalizacion);
    }
  }

  private ajustarTamanoCanvas(): void {
    if (!this.isBrowser || !this.canvas) return;

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  private iniciarEfecto(): void {
    if (!this.isBrowser) return;

    // Detener animación previa si existe
    this.detenerEfecto();

    // Crear partículas
    this.particulas = [];
    for (let i = 0; i < this.densidad; i++) {
      this.particulas.push(this.crearParticula());
    }

    // Guardar tiempo de inicio
    this.tiempoInicio = Date.now();

    // Iniciar animación
    this.ngZone.runOutsideAngular(() => {
      this.animacionId = requestAnimationFrame(this.animar.bind(this));
    });
  }

  private programarFinalizacion(): void {
    if (!this.isBrowser) return;

    // Limpiar timer existente si hay uno
    if (this.timerFinalizacion) {
      clearTimeout(this.timerFinalizacion);
    }

    // Iniciar fadeOut 500ms antes del final para una transición suave
    this.timerFinalizacion = setTimeout(() => {
      this.fadeOut = true;
    }, this.duracion - 500);

    // Detener efectivamente después de la duración completa
    setTimeout(() => {
      this.detenerEfecto();
      this.finAnimacion.emit();
    }, this.duracion);
  }

  private detenerEfecto(): void {
    if (!this.isBrowser) return;

    if (this.animacionId) {
      cancelAnimationFrame(this.animacionId);
      this.animacionId = 0;
    }
  }

  private crearParticula(): Particula {
    if (!this.isBrowser || !this.canvas) return {
      x: 0, y: 0, velocidadY: 0, radio: 0, color: '',
      rotacion: 0, velocidadRotacion: 0, forma: 'cuadrado'
    };

    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * -100 - 100, // Empezar arriba del canvas
      velocidadY: 3 + Math.random() * 5,
      radio: 5 + Math.random() * 10,
      color: this.colores[Math.floor(Math.random() * this.colores.length)],
      rotacion: Math.random() * 360,
      velocidadRotacion: -1 + Math.random() * 2,
      forma: this.formas[Math.floor(Math.random() * this.formas.length)]
    };
  }

  private animar(): void {
    if (!this.isBrowser || !this.canvas || !this.ctx) {
      this.detenerEfecto();
      return;
    }

    // Verificar si debe terminar la animación
    const tiempoActual = Date.now();
    const tiempoTranscurrido = tiempoActual - this.tiempoInicio;

    if (tiempoTranscurrido >= this.duracion) {
      this.detenerEfecto();
      return;
    }

    // Limpiar canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Dibujar y actualizar partículas
    for (const particula of this.particulas) {
      // Dibujar
      this.ctx.save();
      this.ctx.translate(particula.x, particula.y);
      this.ctx.rotate((particula.rotacion * Math.PI) / 180);
      this.ctx.fillStyle = particula.color;

      switch (particula.forma) {
        case 'circulo':
          this.ctx.beginPath();
          this.ctx.arc(0, 0, particula.radio, 0, Math.PI * 2);
          this.ctx.fill();
          break;
        case 'cuadrado':
          this.ctx.fillRect(-particula.radio, -particula.radio, particula.radio * 2, particula.radio * 2);
          break;
        case 'rectangulo':
          this.ctx.fillRect(-particula.radio, -particula.radio / 2, particula.radio * 2, particula.radio);
          break;
        case 'triangulo':
          this.ctx.beginPath();
          this.ctx.moveTo(0, -particula.radio);
          this.ctx.lineTo(-particula.radio, particula.radio);
          this.ctx.lineTo(particula.radio, particula.radio);
          this.ctx.closePath();
          this.ctx.fill();
          break;
      }

      this.ctx.restore();

      // Actualizar posición
      particula.y += particula.velocidadY;
      particula.rotacion += particula.velocidadRotacion;

      // Reiniciar partícula si sale del canvas
      if (particula.y > this.canvas.height + 50) {
        particula.y = Math.random() * -100 - 50;
        particula.x = Math.random() * this.canvas.width;
      }
    }

    // Continuar animación
    this.animacionId = requestAnimationFrame(this.animar.bind(this));
  }
}
