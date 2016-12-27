export function makeDonughtChart(prev = [], curr) {
  return [...prev, Object.assign({}, prev, {value: curr.Total, label: curr.Sucursal})]
}

export function makePieChart(prev = [], curr) {
  return [...prev, Object.assign({}, prev, {value: curr.Porcentaje, label: curr.Respuesta})]
}

interface EncuestasSucursales {
  $id: string,
  Total: number,
  Porcentaje: number,
  Respuesta: number,
  Pregunta: number,
  Sucursal: string
}
