export function makeDonughtChart(prev = [], curr) {
  return [...prev, Object.assign({}, prev, {value: curr.Total, label: curr.Sucursal})]
}

export function makePieChart(prev = [], curr) {
  return [...prev, Object.assign({}, prev, {value: curr.Porcentaje, label: curr.Respuesta})]
}

export function mapPieChart(prev = [[], []], curr) {
  return [[...prev[0], curr.Sucursal], [...prev[1], curr.Total]];
}

interface EncuestasSucursales {
  $id: string,
  Total: number,
  Porcentaje: number,
  Respuesta: number,
  Pregunta: number,
  Sucursal: string
}
