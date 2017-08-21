import { ChartData } from '@models/chartData'
import { OpenAnswerData } from '@models/openAnswerData'

export class BranchChartData {
  constructor(
    public historic: ChartData,
    public ACLOSE: ChartData[],
    public AOPEN: OpenAnswerData[]
  ) {}
}
