import { ChartData } from '@models/chart-data';

export class BranchChartData {
  constructor(public historic: ChartData, public ACLOSE: ChartData[], public AOPEN: ChartData[]) { }

}
