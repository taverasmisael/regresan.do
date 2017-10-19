import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core'

@Component({
  selector: 'app-info-card',
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InfoCardComponent implements OnInit {
  @Input() cardType: 'total' | 'indice' | 'hoy'
  @Input() count: number
  @Input() text: string

  constructor() {}

  ngOnInit() {}
}
