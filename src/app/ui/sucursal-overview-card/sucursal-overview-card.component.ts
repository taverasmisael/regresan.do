import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-sucursal-overview-card',
  templateUrl: './sucursal-overview-card.component.html',
  styleUrls: ['./sucursal-overview-card.component.scss']
})
export class SucursalOverviewCardComponent implements OnInit {

  @Input() sucursal: any;

  constructor() { }

  ngOnInit() {
  }

}
