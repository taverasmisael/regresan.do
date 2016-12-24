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

  private userData: AuthState;
  private AuthState: Observable<AuthState>;
  private currentUser: User;
  private userProfiles: UserProfile[];
  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.AuthState = this.store.select<AppState>('MainStore').map(({auth}) => auth);
    this.AuthState.map(({currentUser}) => {
      return currentUser ? currentUser.User : undefined;
    }).subscribe(currentUser => this.currentUser = currentUser);
    this.AuthState.map(({currentUser}) => {
      return  currentUser ? currentUser.Profiles : undefined;
    }).subscribe(profiles => this.userProfiles = profiles);
  }

  ngAfterViewInit() {
    componentHandler.upgradeAllRegistered();
  }
  logOut() {
    this.store.dispatch({type: ActionTypes.LOGOUT_START})
  }

}
