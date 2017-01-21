import {
  Component,
  OnInit,
  OnChanges,
  Input,
  Output,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';

import compare from 'just-compare';

import { GaugeSegment, GaugeLabel } from 'ng2-kw-gauge';

import { KPI } from '../../models/kpi';
import { GaugeOptions } from '../../models/gauge-options';

import { createGauge } from '../../utilities/gauges';
import { gamaRegresando } from '../../utilities/colors';

@Component({
  selector: 'app-kpi-card',
  templateUrl: './kpi-card.component.html',
  styleUrls: ['./kpi-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KpiCardComponent implements OnInit, OnChanges {

  @Input() kpis: KPI[];
  @Input() errorText: string;
  @Input() loading: boolean;

  public mainKPI: GaugeOptions;
  public secondariesKPI: GaugeOptions[];

  private COLORS = gamaRegresando();

  constructor() { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['kpis'] && changes['kpis'].currentValue.length && !compare(changes['kpis'].previousValue, changes['kpis'].currentValue)) {
      let gauges = this.formatKPIS(<KPI[]>changes['kpis'].currentValue);
      this.spliceKPIS(gauges);
    }
  }

  spliceKPIS(kpis: GaugeOptions[]) {
    this.mainKPI = kpis.slice(0, 1)[0];
    this.secondariesKPI = kpis.slice(1);
  }

  formatKPIS(kpis: KPI[]) {
    return kpis.map((kpi, index) => {
      return createGauge({text: kpi.name, value: kpi.value, color: this.COLORS[index]})
    })
  }
}
