import {
  Component,
  OnInit,
  Input,
  Output,
  ChangeDetectionStrategy,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent implements OnInit {

  @Input() action: {
    icon: string,
    text: string
  };
  @Input() title: string;
  @Input() loadingText: string;
  @Input() loading: boolean;
  @Input() isDataTable: boolean;
  @Input() errorText: string;

  @Output() primaryAction = new EventEmitter();
  @Output() retry = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
