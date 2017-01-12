import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-totales-card',
  templateUrl: './totales-card.component.html',
  styleUrls: ['./totales-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TotalesCardComponent implements OnInit {

  @Input() cardType: 'total' | 'indice' | 'hoy';
  @Input() count: number;
  @Input() text: string;

  constructor() { }

  ngOnInit() {
  }

}
