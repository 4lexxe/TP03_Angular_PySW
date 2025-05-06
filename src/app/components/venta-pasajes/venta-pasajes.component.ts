import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe, PercentPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Boleto, CategoriaTurista } from '../../models/boleto.model';
import { BoletosService } from '../../services/boletos.service';
import { Subscription } from 'rxjs';
import { EstadoBoletoPipe } from '../../pipes/estado-boleto.pipe';

// Interfaz para el resumen de categorías
interface ResumenCategoria {
  categoria: string;
  cantidadBoletos: number;
  totalVentas: number;
  porcentaje: number;
}

@Component({
  selector: 'app-venta-pasajes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DatePipe,
    DecimalPipe,
    PercentPipe,
    EstadoBoletoPipe
  ],
  templateUrl: './venta-pasajes.component.html',
  styleUrl: './venta-pasajes.component.css',
  providers: [DatePipe, DecimalPipe, PercentPipe] // Proveer los pipes para usar por inyección
})
export class VentaPasajesComponent implements OnInit, OnDestroy {
  // Formulario
  boletoForm!: FormGroup;

  // Modo del formulario (crear o editar)
  modoEdicion: boolean = false;
  idBoletoEditando: string | null = null;

  // Lista de boletos
  boletos: Boleto[] = [];

  // Para mostrar mensajes
  mensajeExito: string = '';
  mensajesError: string[] = [];

  // Precio con descuento
  precioConDescuento: number = 0;
  descuentoAplicado: number = 0;
  porcentajeDescuento: number = 0;

  // Categorías para el selector
  categorias = [
    { id: CategoriaTurista.Menor, nombre: 'Menor', descuento: 35 },
    { id: CategoriaTurista.Adulto, nombre: 'Adulto', descuento: 0 },
    { id: CategoriaTurista.Jubilado, nombre: 'Jubilado', descuento: 50 }
  ];

  // Suscripciones
  private suscripciones: Subscription[] = [];

  // Resumen por categorías
  resumenCategorias: ResumenCategoria[] = [];

  // Formatos de fecha y número
  formatoFecha: string = 'dd/MM/yyyy HH:mm';
  formatoFechaCorta: string = 'dd/MM/yyyy';
  formatoMoneda: string = '1.2-2';
  formatoPorcentaje: string = '1.1-1';

  // Propiedad para calcular el total recaudado
  get totalRecaudado(): number {
    return this.boletos.reduce((total, boleto) => total + boleto.precio, 0);
  }

  // Cantidad total de boletos
  get totalBoletos(): number {
    return this.boletos.length;
  }

  constructor(
    private fb: FormBuilder,
    private boletosService: BoletosService,
    private datePipe: DatePipe,
    private decimalPipe: DecimalPipe,
    private percentPipe: PercentPipe
  ) { }

  ngOnInit(): void {
    // Inicializar el formulario
    this.boletoForm = this.fb.group({
      dni: ['', [Validators.required, Validators.pattern('^[0-9]{7,8}$')]],
      precio: [0, [Validators.required, Validators.min(0.01)]],
      categoriaTurista: [CategoriaTurista.Adulto, Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    // Suscribirse a los cambios en los boletos
    this.suscripciones.push(
      this.boletosService.getBoletos().subscribe(boletos => {
        this.boletos = boletos;
        this.calcularResumenCategorias();
      })
    );

    // Suscribirse a los cambios en el formulario para calcular el descuento
    this.suscripciones.push(
      this.boletoForm.get('precio')!.valueChanges.subscribe(() => {
        this.calcularPrecioConDescuento();
      })
    );

    this.suscripciones.push(
      this.boletoForm.get('categoriaTurista')!.valueChanges.subscribe(() => {
        this.calcularPrecioConDescuento();
      })
    );

    // Calcular el precio inicial
    this.calcularPrecioConDescuento();
  }

  ngOnDestroy(): void {
    // Desuscribirse de todas las suscripciones al destruir el componente
    this.suscripciones.forEach(sub => sub.unsubscribe());
  }

  // Método para verificar si se debe mostrar el resumen de precio
  mostrarResumenPrecio(): boolean {
    const precioControl = this.boletoForm.get('precio');
    const categoriaControl = this.boletoForm.get('categoriaTurista');

    return (
      precioControl !== null &&
      categoriaControl !== null &&
      precioControl.value > 0 &&
      categoriaControl.value !== null
    );
  }

  // Calcular el precio con descuento según la categoría del turista
  calcularPrecioConDescuento(): void {
    const precioBase = this.boletoForm.get('precio')!.value || 0;
    const categoria = Number(this.boletoForm.get('categoriaTurista')!.value);

    // Obtener el porcentaje de descuento según la categoría
    const categoriaSeleccionada = this.categorias.find(cat => cat.id === categoria);
    this.porcentajeDescuento = categoriaSeleccionada ? categoriaSeleccionada.descuento : 0;

    // Calcular el descuento
    this.descuentoAplicado = (precioBase * this.porcentajeDescuento) / 100;

    // Calcular el precio final con descuento
    this.precioConDescuento = precioBase - this.descuentoAplicado;
  }

  // Método para enviar el formulario (crear o actualizar)
  onSubmit(): void {
    if (this.boletoForm.valid) {
      // Asegurarse de que categoriaTurista sea un número
      const categoriaTurista = Number(this.boletoForm.get('categoriaTurista')!.value);

      const datosBoleto = {
        ...this.boletoForm.value,
        categoriaTurista: categoriaTurista, // Aseguramos que sea número
        precio: this.precioConDescuento, // Guardar el precio con descuento
        fechaCompra: new Date()
      };

      // Validar el boleto usando el servicio
      const validacion = this.boletosService.validarBoleto(datosBoleto);

      if (validacion.isValid) {
        try {
          if (this.modoEdicion && this.idBoletoEditando) {
            // Actualizar boleto existente
            const boletoActualizado: Boleto = {
              ...datosBoleto,
              id: this.idBoletoEditando,
              // Preservar la fecha original de compra si está editando
              fechaCompra: this.boletos.find(b => b.id === this.idBoletoEditando)?.fechaCompra || new Date()
            };

            const actualizado = this.boletosService.actualizarBoleto(boletoActualizado);
            if (actualizado) {
              this.mensajeExito = 'Boleto actualizado correctamente';
            } else {
              this.mensajesError = ['Error al actualizar el boleto'];
            }
          } else {
            // Crear nuevo boleto (REGISTRAR)
            this.boletosService.agregarBoleto(datosBoleto);
            this.mensajeExito = 'Boleto registrado correctamente';
          }

          this.mensajesError = [];
          this.resetForm();

          // Ocultar el mensaje después de 3 segundos
          setTimeout(() => {
            this.mensajeExito = '';
          }, 3000);
        } catch (error) {
          this.mensajesError = ['Error al procesar el boleto: ' + (error instanceof Error ? error.message : String(error))];
        }
      } else {
        this.mensajesError = validacion.errors;
        this.mensajeExito = '';
      }
    } else {
      this.mensajesError = ['Por favor, complete todos los campos correctamente'];
      this.mensajeExito = '';
    }
  }

  // Refrescar la lista de boletos
  refreshBoletos(): void {
    // Forzar la recarga de los datos desde localStorage
    this.boletosService.recargarBoletos();
  }

  // Editar un boleto existente
  editarBoleto(boleto: Boleto): void {
    // Cambiar a modo edición
    this.modoEdicion = true;
    this.idBoletoEditando = boleto.id || null;

    // Llenar el formulario con los datos del boleto
    this.boletoForm.patchValue({
      dni: boleto.dni,
      precio: this.calcularPrecioSinDescuento(boleto),
      categoriaTurista: boleto.categoriaTurista,
      email: boleto.email
    });

    // Recalcular precio con descuento
    this.calcularPrecioConDescuento();

    // Mostrar mensaje al usuario
    this.mensajeExito = 'Ahora puede editar el boleto. Realice los cambios necesarios y presione "Actualizar Boleto".';
    setTimeout(() => { this.mensajeExito = ''; }, 5000);

    // Desplazarse al formulario
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Hacer foco en el primer campo del formulario
    setTimeout(() => {
      const dniInput = document.getElementById('dni');
      if (dniInput) (dniInput as HTMLInputElement).focus();
    }, 100);
  }

  // Calcular el precio original sin descuento
  calcularPrecioSinDescuento(boleto: Boleto): number {
    const categoriaSeleccionada = this.categorias.find(cat => cat.id === boleto.categoriaTurista);
    const descuento = categoriaSeleccionada ? categoriaSeleccionada.descuento : 0;

    if (descuento > 0) {
      // Si hay descuento, calcular precio original
      return boleto.precio / (1 - (descuento / 100));
    }

    return boleto.precio;
  }

  // Eliminar un boleto
  eliminarBoleto(id?: string): void {
    if (id && confirm('¿Está seguro de que desea eliminar este boleto?')) {
      const eliminado = this.boletosService.eliminarBoleto(id);
      if (eliminado) {
        this.mensajeExito = 'Boleto eliminado correctamente';
        setTimeout(() => {
          this.mensajeExito = '';
        }, 3000);
      } else {
        this.mensajesError = ['Error al eliminar el boleto'];
      }
    }
  }

  // Vaciar todos los boletos
  vaciarBoletos(): void {
    if (confirm('¿Está seguro de que desea eliminar TODOS los boletos? Esta acción no se puede deshacer.')) {
      this.boletosService.vaciarBoletos();
      this.mensajeExito = 'Todos los boletos han sido eliminados';
      setTimeout(() => {
        this.mensajeExito = '';
      }, 3000);
    }
  }

  // Método para cancelar la edición
  cancelarEdicion(): void {
    this.resetForm();
    this.mensajeExito = 'Edición cancelada';
    setTimeout(() => { this.mensajeExito = ''; }, 3000);
  }

  // Método para restablecer el formulario
  resetForm(): void {
    this.boletoForm.reset({
      dni: '',
      precio: 0,
      categoriaTurista: CategoriaTurista.Adulto,
      email: ''
    });

    // Restablecer estado de edición
    this.modoEdicion = false;
    this.idBoletoEditando = null;

    // Recalcular el precio con descuento
    this.calcularPrecioConDescuento();
  }

  // Obtener el texto de la categoría
  getCategoriaTexto(categoria: CategoriaTurista): string {
    return this.boletosService.getCategoriaTexto(categoria);
  }

  // Obtener el porcentaje de descuento según la categoría
  getDescuentoCategoria(categoria: CategoriaTurista): number {
    const categoriaSeleccionada = this.categorias.find(cat => cat.id === categoria);
    return categoriaSeleccionada ? categoriaSeleccionada.descuento : 0;
  }

  // Calcular el resumen por categoría
  calcularResumenCategorias(): void {
    // Reiniciar el resumen
    this.resumenCategorias = [];

    // Si no hay boletos, no hay nada que calcular
    if (this.boletos.length === 0) return;

    // Preparar el objeto de resumen
    const resumen: { [key: number]: { cantidadBoletos: number, totalVentas: number } } = {};

    // Inicializar contadores para cada categoría
    for (const cat of this.categorias) {
      resumen[cat.id] = { cantidadBoletos: 0, totalVentas: 0 };
    }

    // Contar los boletos y sumar ventas por categoría
    for (const boleto of this.boletos) {
      const categoria = boleto.categoriaTurista;
      if (resumen[categoria]) {
        resumen[categoria].cantidadBoletos += 1;
        resumen[categoria].totalVentas += boleto.precio;
      }
    }

    // Convertir a un array para la visualización y calcular porcentajes
    for (const cat of this.categorias) {
      const cantidadBoletos = resumen[cat.id].cantidadBoletos;
      const totalVentas = resumen[cat.id].totalVentas;
      const porcentaje = this.boletos.length > 0 ? (cantidadBoletos / this.boletos.length) * 100 : 0;

      this.resumenCategorias.push({
        categoria: cat.nombre,
        cantidadBoletos,
        totalVentas,
        porcentaje
      });
    }
  }

  // Obtener color de progreso según el porcentaje
  getColorPorcentaje(porcentaje: number): string {
    if (porcentaje < 25) return 'bg-danger';
    if (porcentaje < 50) return 'bg-warning';
    if (porcentaje < 75) return 'bg-info';
    return 'bg-success';
  }

  // Formatear fecha como string
  formatearFecha(fecha: Date): string {
    return this.datePipe.transform(fecha, this.formatoFecha) || '';
  }

  // Formatear precio como string
  formatearPrecio(precio: number): string {
    return this.decimalPipe.transform(precio, this.formatoMoneda) || '';
  }

  // Formatear porcentaje como string
  formatearPorcentaje(valor: number): string {
    return this.percentPipe.transform(valor / 100, this.formatoPorcentaje) || '';
  }
}
