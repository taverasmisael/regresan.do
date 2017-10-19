import { Component, OnInit, Input } from '@angular/core'

import { UserProfile } from '@models/userProfile'

@Component({
  selector: 'app-branch-list',
  templateUrl: './branch-list.component.html',
  styleUrls: ['./branch-list.component.scss']
})
export class BranchListComponent implements OnInit {
  @Input() branches: UserProfile[]
  @Input() colors: string[]

  constructor() {}

  ngOnInit() {}
}
