import { Component, OnInit, AfterViewInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { ActionTypes } from '../../../actions/auth.actions';

import { UserProfile } from '../../../models/userprofile';
import { AppState } from '../../../models/appstate';
import { AuthState } from '../../../models/authstate';

import * as moment from 'moment';
import { PreguntasService } from '../../../services/preguntas.service';
import { mapPieChart, TotalPorDiaLineal } from '../../../utilities/respuestas';
import { mdlPalette } from '../../../utilities/colors';


@Component({
  selector: 'dashboard-overview',
  templateUrl: './dashboard-overview.component.html',
  styleUrls: ['./dashboard-overview.component.scss']
})
export class DashboardOverviewComponent implements OnInit, AfterViewInit {

  private AuthState: Observable<AuthState>;
  private today = moment();
  private testChart: Subscription;
  private aWeekAgo = moment().subtract(7, 'days');
  private dateQuery = {
    start: this.aWeekAgo.unix().toString(),
    end: this.today.unix().toString(),
  };

  public userProfiles: UserProfile[];

  public donutError: string;
  public linearError: string;
  public linearLabels: string[] = [];
  public linearData: any[] = [];
  public donutData: number[] = [];
  public donutLabels: string[] = [];
  public COLORS = mdlPalette('A700', true).sort(() => 0.5 - Math.random());

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
    this.loadDonutChart();
    this.loadLinearChart();
  }

  applyFilters(event) {
    console.log(event);
  }

  loadDonutChart() {
    this.donutError = '';
    this.preguntas.getAll(this.dateQuery)
      .map(res => res['Preguntas'].reduce(mapPieChart, [[], []]))
      .subscribe(
      data => {
        this.donutLabels = data[0];
        this.donutData = data[1];
      },
      error => {
        if (error.status === 401) {
          this.store.dispatch({ type: ActionTypes.LOGOUT_START });
        } else {
          this.donutError = 'Error Cargando Total de Sucursales';
        }
      }
      );
  }

  loadLinearChart() {
    this.linearError = '';
    this.preguntas.getTotalPorDia(this.dateQuery)
      .map(res => TotalPorDiaLineal(res['Encuestas']['TotalesxSucursalxDia']))
      .subscribe(
      data => {
        console.log(data);
        this.linearLabels = data[0];
        this.linearData = data[1].sort((prev, curr) => prev.label > curr.label); // The API doesn't sort this response
      },
      error => {
        if (error.status === 401) {
          this.store.dispatch({ type: ActionTypes.LOGOUT_START });
        } else {
          this.linearError = 'Error Cargando Historico de Encuestas';
        }
      }
      );
  }

}
