import { Component, OnInit, Input, Output, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-kpi-card',
  templateUrl: './kpi-card.component.html',
  styleUrls: ['./kpi-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KpiCardComponent implements OnInit {

  @Input() kpis: any[];
  @Input() errorText: string;
  @Input() loading: boolean;

  constructor() { }

  ngOnInit() {
  }

}
