import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-chart-card',
  templateUrl: './chart-card.component.html',
  styleUrls: ['./chart-card.component.scss']
})
export class ChartCardComponent implements OnInit {

  @Input() chartTitle: string;
  @Input() chartType: string;
  @Input() chartLabels: string[];
  @Input() chartData: any[];

  constructor() { }

  ngOnInit() {
  }

  useDataset(type: string) {
    return type === 'line' || type === 'bar' || type === 'radar'
  }

}
