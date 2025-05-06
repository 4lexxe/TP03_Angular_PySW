import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Boleto, CategoriaTurista } from '../models/boleto.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BoletosService {
  private boletos: Boleto[] = [];
  private boletosSubject = new BehaviorSubject<Boleto[]>([]);
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);

    // Recuperar boletos del localStorage solo si estamos en un navegador
    if (this.isBrowser) {
      this.cargarBoletos();
    }
  }

  // CREATE: Agregar un nuevo boleto
  agregarBoleto(boleto: Boleto): void {
    try {
      // Crear un ID único basado en timestamp
      const nuevoBoleto = {
        ...boleto,
        id: Date.now().toString()
      };

      this.boletos.push(nuevoBoleto);
      this.boletosSubject.next([...this.boletos]);

      // Guardar en localStorage solo si estamos en un navegador
      if (this.isBrowser) {
        this.guardarBoletos();
      }
    } catch (error) {
      console.error('Error al agregar boleto:', error);
      throw new Error('No se pudo agregar el boleto');
    }
  }

  // READ: Obtener todos los boletos
  getBoletos(): Observable<Boleto[]> {
    return this.boletosSubject.asObservable();
  }

  // READ: Obtener un boleto específico por ID
  getBoletoById(id: string): Boleto | undefined {
    return this.boletos.find(boleto => boleto.id === id);
  }

  // UPDATE: Actualizar un boleto existente
  actualizarBoleto(boletoActualizado: Boleto): boolean {
    try {
      const index = this.boletos.findIndex(boleto => boleto.id === boletoActualizado.id);

      if (index !== -1) {
        this.boletos[index] = { ...boletoActualizado };
        this.boletosSubject.next([...this.boletos]);

        // Guardar en localStorage solo si estamos en un navegador
        if (this.isBrowser) {
          this.guardarBoletos();
        }
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error al actualizar boleto:', error);
      return false;
    }
  }

  // DELETE: Eliminar un boleto
  eliminarBoleto(id: string): boolean {
    try {
      const cantidadInicial = this.boletos.length;
      this.boletos = this.boletos.filter(boleto => boleto.id !== id);

      if (cantidadInicial > this.boletos.length) {
        this.boletosSubject.next([...this.boletos]);

        // Guardar en localStorage solo si estamos en un navegador
        if (this.isBrowser) {
          this.guardarBoletos();
        }
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error al eliminar boleto:', error);
      return false;
    }
  }

  // Vaciar toda la lista de boletos
  vaciarBoletos(): void {
    try {
      this.boletos = [];
      this.boletosSubject.next([]);

      // Guardar en localStorage solo si estamos en un navegador
      if (this.isBrowser) {
        this.guardarBoletos();
      }
    } catch (error) {
      console.error('Error al vaciar boletos:', error);
    }
  }

  // Forzar recarga de boletos desde localStorage
  recargarBoletos(): void {
    if (this.isBrowser) {
      this.cargarBoletos();
    }
  }

  // Guardar boletos en localStorage
  private guardarBoletos(): void {
    try {
      if (this.isBrowser) {
        localStorage.setItem('boletos', JSON.stringify(this.boletos));
      }
    } catch (error) {
      console.error('Error al guardar en localStorage:', error);
    }
  }

  // Cargar boletos desde localStorage
  private cargarBoletos(): void {
    try {
      if (this.isBrowser) {
        const boletosGuardados = localStorage.getItem('boletos');
        if (boletosGuardados) {
          this.boletos = JSON.parse(boletosGuardados);
          this.boletosSubject.next([...this.boletos]);
        }
      }
    } catch (error) {
      console.error('Error al cargar desde localStorage:', error);
      this.boletos = [];
      this.boletosSubject.next([]);
    }
  }

  // Obtener el nombre de la categoría
  getCategoriaTexto(categoria: CategoriaTurista): string {
    switch (categoria) {
      case CategoriaTurista.Menor:
        return 'Menor';
      case CategoriaTurista.Adulto:
        return 'Adulto';
      case CategoriaTurista.Jubilado:
        return 'Jubilado';
      default:
        return 'Desconocido';
    }
  }

  // Validar campos del boleto
  validarBoleto(boleto: Boleto): { isValid: boolean, errors: string[] } {
    const errors: string[] = [];

    // Validar DNI (solo números y longitud entre 7 y 8 dígitos)
    if (!/^\d{7,8}$/.test(boleto.dni)) {
      errors.push('El DNI debe tener entre 7 y 8 dígitos numéricos');
    }

    // Validar precio (mayor que cero)
    if (boleto.precio <= 0) {
      errors.push('El precio debe ser mayor que cero');
    }

    // Validar email (formato básico)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(boleto.email)) {
      errors.push('El email debe tener un formato válido');
    }

    // Validar categoría de turista - Se corrige para aceptar categorías como números o strings
    const categoriaNum = Number(boleto.categoriaTurista);
    if (![1, 2, 3].includes(categoriaNum)) {
      errors.push('Categoría de turista inválida');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
