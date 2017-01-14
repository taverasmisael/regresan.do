import * as moment from 'moment';
import { merge, groupBy } from './arrays';

export function makeDonughtChart(prev = [], curr) {
  return [...prev, Object.assign({}, prev, {value: curr.Total, label: curr.Sucursal})]
}

export function makePieChart(prev = [[], []], curr) {
  return [[...prev[0], curr.Respuesta], [...prev[1], curr.Total]];
}

export function mapPieChart(prev = [[], []], curr) {
  return [[...prev[0], curr.Sucursal], [...prev[1], curr.Total]];
}

export function TotalPorDiaLineal(entries: any[], nombre?: string) {

  let labels = []; // Globally store the Labels
  let sucursales = []; // Globally store the Sucursal's name

  const mapped = entries.map(mapData); // Reject the unneded keys
  const transformedData = groupBy(mapped, item => [item.row]) // Group them by date
    .reduce(mockMissingData, []) // Create an entry with value 0 in the date where 'Sucursal' is missing
    .map(el => nombre ? el.filter(curr => curr.serie === nombre) : el) // In case we want an specific 'Sucursal'
    .reduce(transformSeries, []) // Map the data as more simple objects for Chart
    .reduce(merge, []);
  const groupedData = groupBy(transformedData, item => [item.label]) // Group them by 'Sucursal'
    .reduce(prepareLineChart, []); // Prepare data for the Chart

  function mapData(data) {
    sucursales = sucursales.find(el => el === data['Sucursal']) ? sucursales : [...sucursales, data['Sucursal']];
    return {
      total: data['TOTAL_ENCUESTAS'],
      serie: data['Sucursal'],
      row: moment(data['Fecha']).format('DD/MM/YYYY')
    };
  }

  function mockMissingData(prev, curr) {
    labels = labels.find(el => el === curr[0].row) ? labels : [...labels, curr[0].row];
    sucursales.forEach(sucursal => {
      if (!curr.find(el => el.serie === sucursal)) {
        curr = [...curr, {
          row: curr[0].row,
          serie: sucursal,
          total: 0
        }];
      }
    });

    return [...prev, curr];
  }

  function transformSeries(prev, curr) {
    return [...prev, curr.map(el => ({ total: el.total, label: el.serie }))]
  }

  function prepareLineChart(prev, curr) {
    const label = curr[0].label;
    const data = curr.reduce((p, c) => {
      return [...p, c.total];
    }, []);

    return [...prev, {
      data,
      label
    }];
  };

  return [labels, groupedData];
}

interface EncuestasSucursales {
  $id: string,
  Total: number,
  Porcentaje: number,
  Respuesta: number,
  Pregunta: number,
  Sucursal: string
}
