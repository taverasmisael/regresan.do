import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { UserProfile } from '../../../models/userprofile';
import { AuthState } from '../../../models/authstate';
import { AppState } from '../../../models/appstate';

@Component({
  selector: 'app-dashboard-sucursales',
  templateUrl: './dashboard-sucursales.component.html',
  styleUrls: ['./dashboard-sucursales.component.scss']
})
export class DashboardSucursalesComponent implements OnInit {

  private AuthState: Observable<AuthState>;
  private userProfiles: Observable<UserProfile[]>;
  private graphColors: string[] = ["#8BC34A", "#0D47A1", "#009688", "#F44336", "#FFEB3B", "#03A9F4"]
  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.AuthState = this.store.select<AppState>('MainStore')
      .distinctUntilKeyChanged('auth')
      .pluck<AuthState>('auth');

    this.userProfiles = this.AuthState.pluck<UserProfile[]>('currentUser', 'Profiles')
  }

}
