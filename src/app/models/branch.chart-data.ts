import { ChartData } from '@models/chart-data';

export class BranchChartData {
  constructor(public historic: ChartData, public aClose: ChartData[], public aOpen: ChartData[]) { }

}
