import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

import { User } from '../../models/user';

@Component({
  selector: '[dashboard-header]',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardHeaderComponent implements OnInit {
  @Input() user: User;
  constructor() { }

  ngOnInit() {
    console.log(this.user);
  }

}
