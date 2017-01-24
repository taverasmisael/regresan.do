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
  @Input() indiceSatisfaccion: number;
  @Input() errorText: string;
  @Input() loading: boolean;

  public KPIS: GaugeOptions[];
  public IndiceSatisfaccion: GaugeOptions;

  private colors = gamaRegresando().reverse();
  private COLORS = [...this.colors].sort(() => 0.5 - Math.random());

  constructor() { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    let cKpis = changes['kpis'];
    let cIndice = changes['indiceSucursal'];
    if (cKpis && cKpis.currentValue.length && !compare(cKpis.previousValue, cKpis.currentValue)) {
      this.KPIS = this.formatKPIS(<KPI[]>cKpis.currentValue);
    } else if (cIndice && cIndice.currentValue && cIndice.previousValue !== cIndice.currentValue) {
      this.IndiceSatisfaccion = createGauge({text: 'Indice de Satisfacción', value: +cIndice.currentValue, color: this.colors[4]});
    }
  }

  formatKPIS(kpis: KPI[]) {
    return kpis.map((kpi, index) => {
      return createGauge({text: kpi.name, value: kpi.value, color: this.COLORS[index]})
    })
  }
}
