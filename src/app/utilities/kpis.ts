import { KPICamarero } from '../models/kpi-camarero';

export const createLinearCamareroKpi = (data: CamarerosKpi[]) => {
  let labels = [];
  const mapped = data.map((entry, index) => {
    const mappedKpis = entry.Kpis.map(kpi => ({
      nombre: kpi.Nombre,
      value: kpi.Indice
    }));
    labels = [...mappedKpis]
      .reduce((prev, curr) =>
        (labels.findIndex(el => el === curr.nombre) !== -1) ? prev : [...prev, curr.nombre], []
      )
    return {
      label: entry.Session || `Anonimo ${index}`,
      data: mappedKpis.map(kpi => kpi.value),
    }
  });

  return {
    labels,
    data: mapped
  }
}

export interface CamarerosKpi {
  $id: string,
  Session: string,
  Kpis: KPICamarero[]
}
