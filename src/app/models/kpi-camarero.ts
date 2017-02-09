export class KPICamarero {
  $id: string;
  Nombre: string;
  Indice: number;
  TotalEncuesta: number;

  constructor(kpi: KPICamarero) {
    this.$id = kpi.$id;
    this.Nombre = kpi.Nombre;
    this.Indice = kpi.Indice;
    this.TotalEncuesta = kpi.TotalEncuesta;
  }
}
