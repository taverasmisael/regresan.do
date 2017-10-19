import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core'

@Component({
  selector: 'app-branch-info-cards',
  templateUrl: './branch-info-cards.component.html',
  styleUrls: ['./branch-info-cards.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BranchInfoCardsComponent implements OnInit {
  @Input() total: number
  @Input() hoy: number
  @Input() indice: number
  @Input() contactos: number
  @Input() halfCards: boolean
  @Input() fullCards: boolean
  @Input() tipoIndice: string

  constructor() {}

  ngOnInit() {}
}
