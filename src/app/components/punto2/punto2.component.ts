import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Producto {
  nombre: string;
  descripcion: string;
  img: string;
  precio: number;
}

@Component({
  selector: 'app-punto2',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './punto2.component.html',
  styleUrl: './punto2.component.css'
})
export class Punto2Component {
  // Input para hacer el componente reutilizable
  @Input() titulo: string = 'Productos Destacados';
  @Input() productos: Producto[] = [
    {
      nombre: 'Notebook Asus 13L',
      descripcion: 'Disco 40GB, 15 pulgadas, 8GB RAM, Intel i5',
      img: 'https://http2.mlstatic.com/D_665285-MLU74192407227_012024-O.jpg',
      precio: 599.99
    },
    {
      nombre: 'Monitor LG 24"',
      descripcion: 'Monitor LED IPS FullHD 1080p, HDMI, respuesta de 5ms',
      img: 'https://mexx-img-2019.s3.amazonaws.com/47894_1.jpeg',
      precio: 149.99
    },
    {
      nombre: 'Teclado Mecánico RGB',
      descripcion: 'Switches Cherry MX Blue, retroiluminación RGB, Anti-ghosting',
      img: 'https://maxtecno.com.ar/wp-content/uploads/D_NQ_NP_748423-MLA78073498348_082024-O.webp',
      precio: 79.99
    },
    {
      nombre: 'Mouse Gaming Logitech',
      descripcion: 'Sensor óptico de 16000 DPI, 8 botones programables',
      img: 'https://resource.logitechg.com/w_692,c_limit,f_auto,q_auto,f_auto,dpr_2.0/d_transparent.gif/content/dam/gaming/en/products/g502-hero/g502-hero-gallery-1.png',
      precio: 49.99
    },
    {
      nombre: 'Auriculares Bluetooth',
      descripcion: 'Cancelación de ruido activa, batería de 30 horas, micrófono incorporado',
      img: 'https://http2.mlstatic.com/D_NQ_NP_604212-MLA52431995682_112022-O.webp',
      precio: 89.99
    },
    {
      nombre: 'Disco SSD 500GB',
      descripcion: 'Velocidad de lectura 550MB/s, escritura 520MB/s, conexión SATA',
      img: 'https://http2.mlstatic.com/D_747189-MLA40255137191_122019-O.jpg',
      precio: 59.99
    }
  ];

  // Array para almacenar los productos en el carrito
  carritoProductos: Producto[] = [];

  // Total del carrito
  get totalCarrito(): number {
    return this.carritoProductos.reduce((total, producto) => total + producto.precio, 0);
  }

  // Método para agregar un producto al carrito (solo un producto de cada tipo)
  agregarAlCarrito(producto: Producto): void {
    // Verifica si el producto ya está en el carrito
    const existeEnCarrito = this.carritoProductos.some(
      item => item.nombre === producto.nombre
    );

    if (!existeEnCarrito) {
      this.carritoProductos.push(producto);
    } else {
      // Si ya existe, mostrar mensaje o no hacer nada
      alert('Este producto ya está en tu carrito');
    }
  }

  // Método para quitar un producto del carrito
  quitarDelCarrito(index: number): void {
    this.carritoProductos.splice(index, 1);
  }

  // Método para verificar si un producto está en el carrito
  estaEnCarrito(producto: Producto): boolean {
    return this.carritoProductos.some(item => item.nombre === producto.nombre);
  }
}
