import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core'

@Component({
  selector: 'app-chart-in-loop',
  templateUrl: './chart-in-loop.component.html',
  styleUrls: ['./chart-in-loop.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartInLoopComponent implements OnInit {
  @Input() loadingText: any
  @Input() chartInfo: any
  @Input() chartData: any
  @Input() type: any
  @Input() chartTitle: any
  @Input() errorText: any
  @Output() failed = new EventEmitter()

  constructor() {}

  ngOnInit() {}
}
