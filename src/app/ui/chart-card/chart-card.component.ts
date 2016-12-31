import { Component, OnInit, Input } from '@angular/core';

import { createPalette, ChartJsColor, createCirularPalette } from '../../utilities/charts';

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
  @Input() chartColors: string[];

  public ChartColors: any[];

  constructor() { }

  ngOnInit() {
    this.ChartColors = createPalette(this.chartColors)
    if (!this.useDataset(this.chartType)) {
      this.ChartColors = createCirularPalette(this.ChartColors);
    }
  }

  useDataset(type: string) {
    return type === 'line' || type === 'bar' || type === 'radar'
  }

}
