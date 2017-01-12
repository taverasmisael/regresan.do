import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-totales-card',
  templateUrl: './totales-card.component.html',
  styleUrls: ['./totales-card.component.scss']
})
export class TotalesCardComponent implements OnInit {

  @Input() cardType: 'total' | 'indice' | 'hoy';

  constructor() { }

  ngOnInit() {
  }

}
