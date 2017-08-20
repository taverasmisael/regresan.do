import {
  Component,
  OnInit,
  Input,
  Output,
  ChangeDetectionStrategy,
  EventEmitter,
  HostBinding
} from '@angular/core'

import { User } from '../../models/user'

@Component({
  selector: 'app-dashboard-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardHeaderComponent implements OnInit {
  @Input() user: User
  @Output() loginout = new EventEmitter()

  @HostBinding('class.mdl-layout__header') isHeader = true
  @HostBinding('class.mdl-color--primary') isColored = true
  constructor() {}

  ngOnInit() {}
}
