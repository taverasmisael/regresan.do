import { Component, OnInit, AfterViewInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { ActionTypes } from '../actions/auth.actions';
import { AppState } from '../models/states/appstate';
import { AuthState } from '../models/states/authstate';
import { User } from '../models/user';
import { UserProfile } from '../models/userprofile';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  private userData: AuthState;
  private AuthState: Observable<AuthState>;
  private userProfiles: UserProfile[];

  public currentUser: User;
  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.AuthState = this.store.select<AppState>('MainStore')
      .distinctUntilKeyChanged('auth')
      .pluck<AuthState>('auth');

    this.AuthState
      .pluck<User>('currentUser', 'User')
      .subscribe(user => this.currentUser = user);
  }

  ngAfterViewInit() {
    componentHandler.upgradeAllRegistered();
  }
  logOut() {
    this.store.dispatch({type: ActionTypes.LOGOUT_START})
  }

}
