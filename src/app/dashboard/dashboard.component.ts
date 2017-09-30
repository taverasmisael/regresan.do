import { Title } from '@angular/platform-browser'
import { Component, OnInit, AfterViewInit } from '@angular/core'

import { Store } from '@ngrx/store'
import { Observable } from 'rxjs/Observable'

import { ActionTypes } from '@actions/auth.actions'
import { AppState } from '@models/states/app'
import { AuthState } from '@models/states/auth'
import { User } from '@models/user'
import { UserProfile } from '@models/userprofile'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  private userData: AuthState
  private AuthState: Observable<AuthState>
  private userProfiles: UserProfile[]

  public currentUser: User
  constructor(private titleService: Title, private store: Store<AppState>) {}

  ngOnInit() {
    this.titleService.setTitle('Resumén — Regresan.do')
    this.AuthState = this.store.select('auth')

    this.AuthState.pluck('currentUser', 'User').subscribe((user: User) => (this.currentUser = user))
  }

  ngAfterViewInit() {
    componentHandler.upgradeAllRegistered()
  }
  logOut() {
    this.store.dispatch({ type: ActionTypes.LOGOUT_START })
  }
}
