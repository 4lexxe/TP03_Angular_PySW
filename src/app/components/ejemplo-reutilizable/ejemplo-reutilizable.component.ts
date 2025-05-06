import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Punto2Component, Producto } from '../punto2/punto2.component';

@Component({
  selector: 'app-ejemplo-reutilizable',
  standalone: true,
  imports: [CommonModule, Punto2Component],
  template: `
    <div class="container mt-5">
      <h1 class="mb-5">Ejemplo de Reutilización del Componente</h1>

      <!-- Primer uso del componente punto2 -->
      <app-punto2
        [titulo]="'Ofertas Especiales'"
        [productos]="productosEnOferta">
      </app-punto2>

      <!-- Segundo uso del componente punto2 con diferentes datos -->
      <app-punto2
        [titulo]="'Nuevos Lanzamientos'"
        [productos]="productosNuevos">
      </app-punto2>
    </div>
  `
})
export class EjemploReutilizableComponent {
  productosEnOferta: Producto[] = [
    {
      nombre: 'Smartphone Samsung Galaxy',
      descripcion: '128GB de almacenamiento, 8GB RAM, cámara 108MP',
      img: 'https://images.samsung.com/is/image/samsung/p6pim/ar/sm-s911bzkcaro/gallery/ar-galaxy-s23-s911-sm-s911bzkcaro-thumb-534863401',
      precio: 349.99
    },
    {
      nombre: 'Tablet Apple iPad',
      descripcion: '64GB, Pantalla Retina 10.2", WiFi',
      img: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-10th-gen-finish-select-202212-blue-wifi_AV1_FMT_WHH?wid=1280&hei=720&fmt=p-jpg&qlt=95&.v=1670855793635',
      precio: 299.99
    }
  ];

  productosNuevos: Producto[] = [
    {
      nombre: 'Consola PS5',
      descripcion: 'Consola de videojuegos de última generación, incluye control DualSense',
      img: 'https://gmedia.playstation.com/is/image/SIEPDC/ps5-product-thumbnail-01-en-14sep21',
      precio: 499.99
    },
    {
      nombre: 'Laptop MacBook Air',
      descripcion: 'Chip M2, 8GB RAM, 256GB SSD, pantalla de 13.6"',
      img: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-midnight-select-20220606?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1653084303665',
      precio: 999.99
    }
  ];
}
