import { ChartData } from '@models/chart-data';
import { OpenAnswerData } from '@models/answer.open-data';

export class BranchChartData {
  constructor(public historic: ChartData, public ACLOSE: ChartData[], public AOPEN: OpenAnswerData[]) { }

}
