export function makeDonughtChart(prev, curr) {
  console.log('prev', prev);
  console.log('curr', curr);
  return [...prev, Object.assign({}, prev, {data: curr.Total, label: curr.Sucursal})]
}

interface EncuestasSucursales {
  $id: string,
  Total: number,
  Porcentaje: number,
  Respuesta: number,
  Pregunta: number,
  Sucursal: string
}
