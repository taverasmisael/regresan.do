export class StaffRanking {
  $id: string;
  Porcentaje: number;
  Total: number;

  constructor(id: string, porcentaje: number, total: number) {
    this.$id = id;
    this.Porcentaje = porcentaje;
    this.Total = total;
  }
}
