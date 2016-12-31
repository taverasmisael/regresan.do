import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { ActionTypes } from '../../../actions/auth.actions';

import { UserProfile } from '../../../models/userprofile';
import { AppState } from '../../../models/appstate';
import { AuthState } from '../../../models/authstate';

import * as moment from 'moment';
import { PreguntasService} from '../../../services/preguntas.service';
import { mapPieChart, TotalPorDiaLineal } from '../../../utilities/respuestas';


@Component({
  selector: 'dashboard-overview',
  templateUrl: './dashboard-overview.component.html',
  styleUrls: ['./dashboard-overview.component.scss']
})
export class DashboardOverviewComponent implements OnInit, AfterViewInit, OnDestroy {

  private AuthState: Observable<AuthState>;
  private today = moment();
  private testChart: Subscription;
  private aWeekAgo = moment().subtract(7, 'days');

  public userProfiles: UserProfile[];

  public linearLabels: string[] = [];
  public linearData: any[] = [];
  public chartData: number[] = [];
  public chartLabels: string[] = [];
  public graphColors: string[] = ['#8BC34A', '#0D47A1', '#009688', '#F44336', '#FFEB3B', '#03A9F4'];

  constructor(private preguntas: PreguntasService, private store: Store<AppState>) { }

  ngOnInit() {
    this.AuthState = this.store.select<AppState>('MainStore')
      .distinctUntilKeyChanged('auth')
      .pluck<AuthState>('auth');

    this.AuthState
    .pluck<UserProfile[]>('currentUser', 'Profiles')
    .subscribe(profiles => this.userProfiles = profiles);
  }
  ngAfterViewInit() {
    let query = {
      start: this.aWeekAgo.unix().toString(),
      end: this.today.unix().toString(),
    }
    this.testChart = this.preguntas.getAll(query)
      .map(res => res['Preguntas'].reduce(mapPieChart, [[], []]))
      .subscribe(
        data => {
          this.chartLabels = data[0];
          this.chartData = data[1];
        },
        error => error.status === 401 && this.store.dispatch({type: ActionTypes.LOGOUT_START})
      );
    this.preguntas.getTotalPorDia(query)
      .map(res => TotalPorDiaLineal(res['Encuestas']['TotalesxSucursalxDia']))
      .subscribe(
        data => {
          console.log(data);
          this.linearLabels = data[0];
          this.linearData = data[1];
        },
        error => error.status === 401 && this.store.dispatch({type: ActionTypes.LOGOUT_START})
      );
  }

  ngOnDestroy() {
    // Clean Up Subscription
    this.testChart.unsubscribe();
  }

}
