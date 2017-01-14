import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-totales-container',
  templateUrl: './totales-container.component.html',
  styleUrls: ['./totales-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TotalesContainerComponent implements OnInit {

  @Input() total: number;
  @Input() hoy: number;
  @Input() indice: number;
  @Input() contactos: number;
  @Input() halfCards: boolean;
  @Input() fullCards: boolean;

  constructor() { }

  ngOnInit() {
  }

}
