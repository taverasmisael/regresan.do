import {
  Component,
  OnInit,
  OnChanges,
  Input,
  Output,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'app-kpi-card',
  templateUrl: './kpi-card.component.html',
  styleUrls: ['./kpi-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KpiCardComponent implements OnInit, OnChanges {

  @Input() kpis: any[];
  @Input() errorText: string;
  @Input() loading: boolean;

  public mainKPI: any;
  public secondariesKPI: any[];

  constructor() { }

  ngOnInit() {
    this.spliceKPIS(this.kpis);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['kpis'] && (changes['kpis'].previousValue !== changes['kpis'].currentValue)) {
      this.spliceKPIS(changes['kpis'].currentValue);
    }
  }

  spliceKPIS(kpis: any[]) {
    this.mainKPI = this.kpis.slice(0, 1)[0];
    this.secondariesKPI = this.kpis.slice(1);
  }
}
