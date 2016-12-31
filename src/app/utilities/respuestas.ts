import * as moment from 'moment';

export function makeDonughtChart(prev = [], curr) {
  return [...prev, Object.assign({}, prev, {value: curr.Total, label: curr.Sucursal})]
}

export function makePieChart(prev = [], curr) {
  return [...prev, Object.assign({}, prev, {value: curr.Porcentaje, label: curr.Respuesta})]
}

export function mapPieChart(prev = [[], []], curr) {
  return [[...prev[0], curr.Sucursal], [...prev[1], curr.Total]];
}

export function TotalPorDiaLineal(entries: any[]) {
  let labels = [];

  const transformedArray = [ // once transformed we return it at the bottom
    entries.map(mapData)
    .reduce(reduceDataToArray, [])
    .reduce(groupData, {})
  ].reduce(prepareLineChart, []);

  function mapData(data) {
    return {
      total: data['TOTAL_ENCUESTAS'],
      serie: data['Sucursal'],
      row: data['Fecha']
    };
  }
  function reduceDataToArray(prev, curr) {
    const key = curr.row;
    labels = labels.find(el => el === moment(curr.row).format('D/M/YY')) ? labels : [...labels, moment(curr.row).format('D/M/YY')];
    prev[key] = prev[key] || [];
    const prevData = prev[key].data || [];
    return [...prev, {
      data: [...prevData, curr.total],
      label: curr.serie
    }];
  };

  function groupData(prev, curr) {
    const key = curr.label;
    prev[key] = prev[key] || [];
    prev[key] = [...prev[key], ...curr.data];

    return prev;

  };

  function prepareLineChart(prev, curr) {
    // tslint:disable-next-line:forin
    for (let key in curr) {
      let currentSerie = { label: key, data: curr[key] };
      prev = [...prev, currentSerie];
    }

    return prev;
  };

  return [labels, transformedArray];
}

interface EncuestasSucursales {
  $id: string,
  Total: number,
  Porcentaje: number,
  Respuesta: number,
  Pregunta: number,
  Sucursal: string
}
