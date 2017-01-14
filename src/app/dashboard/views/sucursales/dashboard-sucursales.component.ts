import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { UserProfile } from '../../../models/userprofile';
import { AuthState } from '../../../models/authstate';
import { AppState } from '../../../models/appstate';
import { gamaRegresando } from '../../../utilities/colors';

@Component({
  selector: 'app-dashboard-sucursales',
  templateUrl: './dashboard-sucursales.component.html',
  styleUrls: ['./dashboard-sucursales.component.scss']
})
export class DashboardSucursalesComponent implements OnInit {

  public userProfiles: Observable<UserProfile[]>;
  public colores: string[];

  private AuthState: Observable<AuthState>;

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.AuthState = this.store.select<AppState>('MainStore')
      .distinctUntilKeyChanged('auth')
      .pluck<AuthState>('auth');

    this.colores = gamaRegresando();

    this.userProfiles = this.AuthState.pluck<UserProfile[]>('currentUser', 'Profiles')
  }

}
