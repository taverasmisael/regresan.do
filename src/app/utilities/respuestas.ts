export function makeDonughtChart(prev = [], curr) {
  return [...prev, Object.assign({}, prev, {value: curr.Total, label: curr.Sucursal})]
}

interface EncuestasSucursales {
  $id: string,
  Total: number,
  Porcentaje: number,
  Respuesta: number,
  Pregunta: number,
  Sucursal: string
}
