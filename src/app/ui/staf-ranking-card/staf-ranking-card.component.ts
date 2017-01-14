import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'app-staf-ranking-card',
  templateUrl: './staf-ranking-card.component.html',
  styleUrls: ['./staf-ranking-card.component.scss']
})
export class StafRankingCardComponent implements OnInit {
  @Input() staffData: any[];
  @Input() errorText: string[];
  @Input() loading: string[];

  @Output() failed = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
