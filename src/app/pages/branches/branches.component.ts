import { Title } from '@angular/platform-browser'
import { Component, OnInit } from '@angular/core'

import { Store } from '@ngrx/store'
import { Observable } from 'rxjs/Observable'

import { UserProfile } from '@models/userprofile'
import { AuthState } from '@models/states/auth'
import { AppState } from '@models/states/app'
import { gamaRegresando } from '@utilities/colors'

@Component({
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.scss']
})
export class BranchesComponent implements OnInit {
  public userProfiles: Observable<UserProfile[]>
  public colores: string[]

  private AuthState: Observable<AuthState>

  constructor(private titleService: Title, private store: Store<AppState>) {}

  ngOnInit() {
    this.titleService.setTitle('Sucursales — Regresan.do')
    this.AuthState = this.store.select('auth')

    this.AuthState.subscribe(state =>
      this.titleService.setTitle(
        `Sucursales ${state.currentUser.User['FullName'].split(' ')[0]} — Regresan.do`
      )
    )
    this.colores = gamaRegresando()

    this.userProfiles = this.AuthState.pluck('currentUser', 'Profiles')
  }
}
