import { Component, OnInit, AfterViewInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import * as moment from 'moment';

import { PreguntasService } from '@services/preguntas.service';

import { ActionTypes } from '@actions/auth.actions';

import { UserProfile } from '@models/userprofile';
import { AppState } from '@models/states/appstate';
import { AuthState } from '@models/states/authstate';
import { APIRequestParams } from '@models/apiparams';
import { DateFilter } from '@models/filter-date';

import { merge, sum } from '@utilities/arrays';
import { mapPieChart, TotalPorDiaLineal } from '@utilities/respuestas';
import { gamaRegresando } from '@utilities/colors';


@Component({
  selector: 'app-dashboard-overview',
  templateUrl: './dashboard-overview.component.html',
  styleUrls: ['./dashboard-overview.component.scss']
})
export class DashboardOverviewComponent implements OnInit, AfterViewInit {

  public userProfiles: UserProfile[];
  public currentQuery: DateFilter;

  public totalToday: BehaviorSubject<number>;
  public totalGeneral: BehaviorSubject<number>;
  public newContacts: BehaviorSubject<number>;
  public branchIndex: BehaviorSubject<number>;

  public generalSurveyError: string;
  public generalSurveyData: number[];
  public generalSurveyLabels: string[];
  public generalSurveyLoading: Boolean;
  public historicSurveyLoading: Boolean;
  public historicSurveyError: string;
  public historicSurveyLabels: string[];
  public historicSurveyData: any[];
  public branchColors: any;

  private AuthState: Observable<AuthState>;

  constructor(private preguntas: PreguntasService, private store: Store<AppState>) { }

  ngOnInit() {
    this.AuthState = this.store.select<AppState>('MainStore')
      .distinctUntilKeyChanged('auth')
      .pluck<AuthState>('auth');

    this.AuthState
      .pluck<UserProfile[]>('currentUser', 'Profiles')
      .subscribe(profiles => this.userProfiles = profiles);

    this.totalToday = new BehaviorSubject(0);
    this.totalGeneral = new BehaviorSubject(0);
    this.newContacts = new BehaviorSubject(0);
    this.branchIndex = new BehaviorSubject(0);

    this.generalSurveyData = [];
    this.generalSurveyLabels = [];
    this.historicSurveyLabels = [];
    this.historicSurveyData = [];

    this.currentQuery = {
      start: moment().subtract(1, 'week').unix().toString(),
      end: moment().unix().toString(),
    };

    this.branchColors = gamaRegresando();
  }
  ngAfterViewInit() {
    this.FetchAll(this.currentQuery);
  }

  public ApplyFilters(filter: DateFilter) {
    const { start, end } = filter;
    this.currentQuery = {
      start: moment.unix(+start).isValid() ? start : moment(start).format('X'),
      end: moment.unix(+end).isValid() ? end : moment(end).format('X')
    };

    this.FetchAll(this.currentQuery);
  }

  public LoadGeneralSurvey(query: APIRequestParams) {
    this.generalSurveyLoading = true;
    this.generalSurveyError = '';
    this.preguntas.getAll(query)
      .map(res => res['Preguntas'].reduce(mapPieChart, [[], []]))
      .subscribe(
      data => {
        if (data[1].length) {
          this.generalSurveyLabels = data[0];
          this.generalSurveyData = data[1];
          this.generalSurveyLoading = false;
        } else {
          this.generalSurveyLoading = false;
          this.generalSurveyError = 'No se ha encontrado información con esos requisitos. Cambie el filtro e intente de nuevo';
        }
      },
      error => {
        this.generalSurveyLoading = false;
        if (error.status === 401) {
          this.store.dispatch({ type: ActionTypes.LOGOUT_START });
        } else {
          this.generalSurveyError = 'Error Cargando Total de Sucursales';
        }
      }
      );
  }

  public LoadHistoricSurvey(query: APIRequestParams) {
    this.historicSurveyLoading = true;
    this.historicSurveyError = '';

    this.preguntas.getTotalPorDia(query)
      .map(res => TotalPorDiaLineal(res['Encuestas']['TotalesxSucursalxDia'].sort((prev, curr) => {
        let mp = moment(prev.Fecha);
        let mc = moment(curr.Fecha);
        return mp.isSameOrAfter(mc) ? 1 : -1;
      })))
      .subscribe(
      data => {
        if (data[1].length) {
          this.historicSurveyLabels = data[0];
          this.historicSurveyData = data[1].sort((prev, curr) => prev.label > curr.label); // The API doesn't sort this response
          this.historicSurveyLoading = false;
        } else {
          this.historicSurveyLoading = false;
          this.historicSurveyError = 'No se ha encontrado información con esos requisitos. Cambie el filtro e intente de nuevo';
        }
      },
      error => {
        this.historicSurveyLoading = false;
        if (error.status === 401) {
          this.store.dispatch({ type: ActionTypes.LOGOUT_START });
        } else {
          this.historicSurveyError = 'Error Cargando Historico de Encuestas';
        }
      }
      );
  }

  public LoadResumen(query: APIRequestParams) {
    this.preguntas.getResumen(query)
      .map(res => res['Cabecera'])
      .subscribe(res => {
        if (res) {
          this.totalToday.next(res['TotalEncuestadosHoy']);
          this.totalGeneral.next(res['TotalEncuestas']);
          this.newContacts.next(res['NuevosContactos']);
          this.branchIndex.next(res['IndiceSucursal']);
        } else {
          this.totalToday.next(0);
          this.totalGeneral.next(0);
          this.newContacts.next(0);
          this.branchIndex.next(0);
        }
      });
  }

  // Private Helpers

  private FetchAll(query: APIRequestParams) {
    this.LoadGeneralSurvey(query);
    this.LoadHistoricSurvey(query);
    this.LoadResumen(query);
  }
}
