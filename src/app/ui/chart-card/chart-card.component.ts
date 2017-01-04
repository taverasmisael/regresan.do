import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';

import { createPalette, ChartJsColor, createCirularPalette } from '../../utilities/charts';

@Component({
  selector: 'app-chart-card',
  templateUrl: './chart-card.component.html',
  styleUrls: ['./chart-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartCardComponent implements OnInit {

  @Input() chartTitle: string;
  @Input() chartType: string;
  @Input() errorText: string;
  @Input() lodingText: string;
  @Input() chartLabels: string[];
  @Input() chartData: any[];
  @Input() chartColors: string[];
  @Input() loading: Boolean;

  @Output() failed = new EventEmitter();

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

  toggleChart() {
    switch (this.chartType ) {
      case 'line':
        this.chartType = 'bar';
        break;
      case 'bar':
        this.chartType = 'line';
        break;
      case 'doughnut':
        this.chartType = 'pie';
        break;
      case 'pie':
        this.chartType = 'doughnut';
        break;
    }
  }

}
