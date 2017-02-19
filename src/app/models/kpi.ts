export class KPI {
  $id: string;
  Indice: number;
  Nombre: string;
  TotalEncuesta: number;

  constructor(id: string, indice: number, nombre: string, encuestas: number) {
    this.$id = id;
    this.Indice = indice;
    this.Nombre = nombre;
    this.TotalEncuesta = encuestas;
  }
}
