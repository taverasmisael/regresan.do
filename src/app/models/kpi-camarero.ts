export class KPICamarero {
  $id: string;
  Nombre: string;
  Indice: number;
  TotalEncusta: number;

  constructor(kpi: KPICamarero) {
    this.$id = kpi.$id;
    this.Nombre = kpi.Nombre;
    this.Indice = kpi.Indice;
    this.TotalEncusta = kpi.TotalEncusta;
  }
}
