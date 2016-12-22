import { Component, OnInit, AfterViewInit } from '@angular/core';

import * as moment from 'moment';
import { RespuestasService} from '../services/respuestas.service';
import { makeDonughtChart} from '../utilities/respuestas';

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
  private Store: Observable<AppState>;
  private currentUser: Observable<User>;
  private userProfiles: Observable<UserProfile[]>
  private today = moment();
  private aWeekAgo = this.today.subtract(7, 'days');
  private graphColors: string[] = ["#8BC34A", "#0D47A1", "#009688", "#F44336", "#FFEB3B", "#03A9F4"]
  constructor(private store: Store<AppState>, private respuestas: RespuestasService) { }

  ngOnInit() {
    this.Store = this.store.select<AppState>('MainStore');
    this.userData = this.Store.map(slice => slice.auth);
    this.currentUser = this.userData.map(userData => {
      return userData &&userData.currentUser ? userData.currentUser.User : undefined;
    });
    this.userProfiles = this.userData.map(userData => {
      return  userData && userData.currentUser ? userData.currentUser.Profiles : undefined;
    });
    this.respuestas.getAll(this.aWeekAgo.unix(), this.today.unix())
      .map(res => res['Preguntas'].reduce(makeDonughtChart, []))
      .subscribe(data => {
        Morris.Donut({
          element: 'chartSucursales',
          data,
          colors: this.graphColors.sort(() => 0.5 - Math.random())
        })
      })
  }

  ngAfterViewInit() {
    componentHandler.upgradeAllRegistered();
  }
  logOut() {
    this.store.dispatch({type: ActionTypes.LOGOUT_START})
  }

}
