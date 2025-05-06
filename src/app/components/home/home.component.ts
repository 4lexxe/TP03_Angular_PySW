import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface RutaDestacada {
  titulo: string;
  descripcion: string;
  ruta: string;
  icono: string;
  imagen: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  rutas: RutaDestacada[] = [
    {
      titulo: 'Punto 1 - Noticias',
      descripcion: 'Galería de noticias con navegación entre ellas',
      ruta: '/punto1',
      icono: 'bi-newspaper',
      imagen: 'https://primerapagina.info/vistas/uploads/e716005a645b73903f0a6ad23718c0ac.webp'
    },
    {
      titulo: 'Punto 2 - Productos',
      descripcion: 'Catálogo de productos con carrito de compras',
      ruta: '/punto2',
      icono: 'bi-cart',
      imagen: 'https://http2.mlstatic.com/D_609036-MLA81807885251_012025-C.jpg'
    },
    {
      titulo: 'Punto 3 - Ahorcado',
      descripcion: 'Juego del ahorcado con diferentes niveles de dificultad',
      ruta: '/punto3',
      icono: 'bi-controller',
      imagen: 'https://selecciones.com.ar/wp-content/uploads/2023/03/encasa-a-jugar-a-un-clasico-junto-al-tutti-frutti-el-ahorcado-5625-mainImage-0.jpg'
    },
    {
      titulo: 'Venta de Pasajes',
      descripcion: 'Sistema de venta de pasajes con descuentos por categoría',
      ruta: '/venta-pasajes',
      icono: 'bi-ticket-perforated',
      imagen: 'https://pbs.twimg.com/profile_images/875086564862304256/sQ7OThrx_400x400.jpg'
    }
  ];
}
