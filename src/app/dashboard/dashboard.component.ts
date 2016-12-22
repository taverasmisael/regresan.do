import { Component, OnInit, AfterViewInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { ActionTypes } from '../actions/auth.actions';
import { AppState } from '../models/appstate';
import { AuthState } from '../models/authstate';
import { User } from '../models/user';
import { UserProfile } from '../models/userprofile';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  private userData: Observable<AuthState>;
  private AuthState: Observable<AuthState>;
  private currentUser: Observable<User>;
  private userProfiles: Observable<UserProfile[]>
  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.AuthState = this.store.select<AppState>('MainStore').map(({auth}) => auth);;
    this.currentUser = this.AuthState.map(({currentUser}) => {
      return currentUser ? currentUser.User : undefined;
    });
    this.userProfiles = this.AuthState.map(({currentUser}) => {
      return  currentUser ? currentUser.Profiles : undefined;
    });
  }

  ngAfterViewInit() {
    componentHandler.upgradeAllRegistered();
  }
  logOut() {
    this.store.dispatch({type: ActionTypes.LOGOUT_START})
  }

}
