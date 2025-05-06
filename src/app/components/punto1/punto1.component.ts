import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Noticia {
  titulo: string;
  noticia: string;
  img: string;
}

@Component({
  selector: 'app-punto1',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './punto1.component.html',
  styleUrl: './punto1.component.css'
})
export class Punto1Component {
  noticias: Noticia[] = [
    {
      titulo: 'Cuidados para gatos con diarrea',
      noticia: 'La diarrea en gatos puede ser causada por cambios en la dieta, parásitos o enfermedades subyacentes. Consulta a tu veterinario si persiste más de 24 horas.',
      img: 'https://es.onlyfresh.com/cdn/shop/articles/AManova_diarrea_nei_gatti.jpg'
    },
    {
      titulo: '¿Los gatos ven en color?',
      noticia: 'Los gatos tienen una visión diferente a la humana. Pueden ver bien en la oscuridad pero distinguen menos colores, principalmente azules y verdes.',
      img: 'https://okdiario.com/img/2022/10/18/los-gatos-pueden-ver-en-color-1.jpg'
    },
    {
      titulo: 'Beneficios de adoptar un gato',
      noticia: 'Adoptar un gato reduce el estrés, mejora tu salud cardiovascular y proporciona compañía. Los gatos son mascotas independientes ideales para personas ocupadas.',
      img: 'https://es.mypet.com/wp-content/uploads/sites/23/2021/03/GettyImages-623368750-e1582816063521-1.jpg'
    },
    {
      titulo: 'Comportamientos curiosos de los gatos',
      noticia: 'Los gatos tienen comportamientos instintivos como amasar, esconderse en cajas o correr repentinamente. Esto se debe a su naturaleza cazadora y territorial.',
      img: 'https://s1.ppllstatics.com/lasprovincias/www/multimedia/202112/12/media/cortadas/gatos-kb2-U160232243326NVC-1248x770@Las%20Provincias.jpg'
    }
  ];

  indiceActual: number = 0;

  avanzar(): void {
    this.indiceActual = (this.indiceActual + 1) % this.noticias.length;
  }

  retroceder(): void {
    this.indiceActual = (this.indiceActual - 1 + this.noticias.length) % this.noticias.length;
  }
}
