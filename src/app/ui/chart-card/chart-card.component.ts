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
  @Input() lodingText: string;
  @Input() chartLabels: string[];
  @Input() chartData: any[];
  @Input() chartColors: string[];
  @Input() loading: Boolean;
  @Input() headerShadow: Boolean;

  @Output() failed = new EventEmitter();

  public ChartColors: any[];

  constructor() { }

  ngOnInit() {
    this.ChartColors = createPalette(this.chartColors, 0.4)
    if (!this.useDataset(this.chartType)) {
      this.ChartColors = createCirularPalette(createPalette(this.chartColors));
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['loading'] && changes['loading'].currentValue === true) {
      setTimeout(() => {
        componentHandler.upgradeDom();
        componentHandler.upgradeAllRegistered();
      }, 200)
    } else if (changes['chartColors']) {
      this.ngOnInit();
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
