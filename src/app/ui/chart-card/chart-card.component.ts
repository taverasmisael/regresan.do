import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import { createPalette, ChartJsColor, createCirularPalette } from '../../utilities/charts';
import { updateObject } from '../../utilities/objects';

@Component({
  selector: 'app-chart-card',
  templateUrl: './chart-card.component.html',
  styleUrls: ['./chart-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartCardComponent implements OnInit, OnChanges {

  @Input() chartTitle: string;
  @Input() chartType: string;
  @Input() errorText: string;
  @Input() loadingText: string;
  @Input() chartLabels: string[];
  @Input() chartData: any[];
  @Input() chartColors: string[];
  @Input() loading: Boolean;
  @Input() headerShadow: Boolean;

  @Output() failed = new EventEmitter();

  public ChartColors: any[];
  public linearChartOptions: any;
  public circularChartOptions: any;

  private baseChartOptions: any;

  constructor() { }

  ngOnInit() {
    let circularOptions = {};
    let linearOptions = { scales: { yAxes: [{ ticks: { beginAtZero: true } }] } };
    this.baseChartOptions = { responsive: true, maintainAspectRatio: false };
    this.linearChartOptions = updateObject(this.baseChartOptions, linearOptions);
    this.circularChartOptions = updateObject(this.baseChartOptions, circularOptions);
    this.updatePalette();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['loading'] && changes['loading'].currentValue === true) {
      setTimeout(() => {
        componentHandler.upgradeDom();
        componentHandler.upgradeAllRegistered();
      }, 200)
    } else if (changes['chartColors']) {
      this.updatePalette();
    }
  }

  useDataset(type: string) {
    return type === 'line' || type === 'bar' || type === 'radar'
  }

  toggleChart() {
    switch (this.chartType) {
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

  private updatePalette() {
    this.ChartColors = createPalette(this.chartColors, 0.4)
    if (!this.useDataset(this.chartType)) {
      this.ChartColors = createCirularPalette(createPalette(this.chartColors));
    }
  }
}
