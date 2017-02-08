import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { IndiceCamarerosComponent } from '../../indice-camareros/indice-camareros.component'

@Component({
  selector: 'app-staf-ranking-card',
  templateUrl: './staf-ranking-card.component.html',
  styleUrls: ['./staf-ranking-card.component.scss']
})
export class StafRankingCardComponent implements OnInit {
  @Input() staffData: any[];
  @Input() errorText: string;
  @Input() loading: boolean;

  @ViewChild('indiceCamareros') indiceCamareros: IndiceCamarerosComponent;

  public cardAction: any;

  @Output() failed = new EventEmitter();

  constructor() { }

  ngOnInit() {
    this.cardAction = { icon: 'add', text: 'Ver Más Detalles', id: 'staff-ranking-card__action' };
  }

  onPrimaryAction(event) {
    console.log(this.indiceCamareros.showDialog());
  }

}
