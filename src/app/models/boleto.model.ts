export enum CategoriaTurista {
  Menor = 1,
  Adulto = 2,
  Jubilado = 3
}

export interface Boleto {
  id?: string;          // ID único (opcional para nuevos boletos)
  dni: string;
  precio: number;
  categoriaTurista: CategoriaTurista;
  fechaCompra: Date;
  email: string;
}
