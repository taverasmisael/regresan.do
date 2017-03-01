export class HistoricEntry {
  $id: string;
  Fecha: string;
  ProfileId: number;
  Sucursal: string;
  TOTAL_ENCUESTAS: number;

  constructor(id: string, date: string, profile: number, branch: string, surveys: number) {
    this.$id = id;
    this.Fecha = date;
    this.Sucursal = branch;
    this.TOTAL_ENCUESTAS = surveys;
  }
}
