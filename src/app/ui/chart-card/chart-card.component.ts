import { Component, OnInit, Input } from '@angular/core';

import { createPalette, ChartJsColor } from '../../utilities/charts';
import { mdlPalette } from '../../utilities/colors';

@Component({
  selector: 'app-chart-card',
  templateUrl: './chart-card.component.html',
  styleUrls: ['./chart-card.component.scss']
})
export class ChartCardComponent implements OnInit {

  @Input() chartTitle: string;
  @Input() chartType: string;
  @Input() lodingText: string;
  @Input() chartLabels: string[];
  @Input() chartData: any[];

  private COLORS = mdlPalette('A700', true);
  public chartColors: ChartJsColor[];

  constructor() { }

  ngOnInit() {
    this.chartColors = createPalette(this.COLORS.sort(() => 0.5 - Math.random()));
  }

  useDataset(type: string) {
    return type === 'line' || type === 'bar' || type === 'radar'
  }

}
