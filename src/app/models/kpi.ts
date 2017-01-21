export class KPI {
  $id: string;
  name: string;
  value: number;

  constructor(kpi: KPI) {
    this.$id = kpi.$id;
    this.name = kpi.name;
    this.value = kpi.value;
  }
}
