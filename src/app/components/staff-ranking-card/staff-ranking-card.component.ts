import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter
} from '@angular/core'

import { StaffIndexComponent } from '@components/staff-index/staff-index.component'

import { StandardRequest } from '@models/standardRequest'

@Component({
  selector: 'app-staff-ranking-card',
  templateUrl: './staff-ranking-card.component.html',
  styleUrls: ['./staff-ranking-card.component.scss']
})
export class StaffRankingCardComponent implements OnInit {
  @Input() staffData: any[]
  @Input() errorText: string
  @Input() loading: boolean
  @Input() currentFilter: StandardRequest

  @ViewChild('staffIndex') staffIndex: StaffIndexComponent

  public cardAction: any

  @Output() failed = new EventEmitter()

  constructor() {}

  ngOnInit() {
    this.cardAction = { icon: 'info', text: 'Ver Más Detalles', id: 'staff-ranking-card__action' }
  }

  onPrimaryAction(event) {
    this.staffIndex.showDialog()
  }
}
