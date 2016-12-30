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
import { makeDonughtChart} from '../../../utilities/respuestas';


@Component({
  selector: 'dashboard-overview',
  templateUrl: './dashboard-overview.component.html',
  styleUrls: ['./dashboard-overview.component.scss']
})
export class DashboardOverviewComponent implements OnInit, AfterViewInit, OnDestroy {

  private AuthState: Observable<AuthState>;
  private today = moment();
  private testChart: Subscription;
  private aWeekAgo = this.today.subtract(7, 'days');

  public graphColors: string[] = ['#8BC34A', '#0D47A1', '#009688', '#F44336', '#FFEB3B', '#03A9F4']
  public userProfiles: UserProfile[];

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
      .map(res => res['Preguntas'].reduce(makeDonughtChart, []))
      .subscribe(
        console.log.bind(console),
        error => error.status === 401 && this.store.dispatch({type: ActionTypes.LOGOUT_START})
      );
  }

  ngOnDestroy() {
    // Clean Up Subscription
    this.testChart.unsubscribe();
  }

}
