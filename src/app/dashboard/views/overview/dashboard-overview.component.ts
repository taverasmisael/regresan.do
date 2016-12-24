import 'morris.js/morris.min.js';

import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { ActionTypes } from '../../../actions/auth.actions';

import { UserProfile } from '../../../models/userprofile';
import { AppState } from '../../../models/appstate';
import { AuthState } from '../../../models/authstate';

import * as moment from 'moment';
import { RespuestasService} from '../../../services/respuestas.service';
import { makeDonughtChart} from '../../../utilities/respuestas';


@Component({
  selector: 'dashboard-overview',
  templateUrl: './dashboard-overview.component.html',
  styleUrls: ['./dashboard-overview.component.scss']
})
export class DashboardOverviewComponent implements OnInit, AfterViewInit, OnDestroy {

  private AuthState: Observable<AuthState>;
  private userProfiles: UserProfile[];
  private today = moment();
  private testChart: Subscription;
  private aWeekAgo = this.today.subtract(7, 'days');
  private graphColors: string[] = ["#8BC34A", "#0D47A1", "#009688", "#F44336", "#FFEB3B", "#03A9F4"]
  constructor(private respuestas: RespuestasService, private store: Store<AppState>) { }

  ngOnInit() {
    this.AuthState = this.store.select<AppState>('MainStore').map(({auth}) => auth);
    this.AuthState.map(({currentUser}) => currentUser ? currentUser.Profiles : undefined)
    .subscribe(profiles => this.userProfiles = profiles);
  }
  ngAfterViewInit() {
    this.testChart = this.respuestas.getAll(this.aWeekAgo.unix(), this.today.unix())
      .map(res => res['Preguntas'].reduce(makeDonughtChart, []))
      .subscribe(data => {
        Morris.Donut({
          element: 'chartSucursales',
          data,
          colors: this.graphColors
        })
      },
      error => {console.log(error); this.store.dispatch({type: ActionTypes.LOGOUT_START})});
  }

  ngOnDestroy() {
    // Clean Up Subscription
    this.testChart.unsubscribe();
  }

}
