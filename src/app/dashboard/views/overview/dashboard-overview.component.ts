import { Component, OnInit, AfterViewInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { ActionTypes } from '../../../actions/auth.actions';

import { UserProfile } from '../../../models/userprofile';
import { AppState } from '../../../models/appstate';
import { AuthState } from '../../../models/authstate';
import { APIRequestParams } from '../../../models/apiparams';
import { Filter } from '../../../models/filter';

import * as moment from 'moment';
import { PreguntasService } from '../../../services/preguntas.service';

import { merge, sum } from '../../../utilities/arrays';
import { mapPieChart, TotalPorDiaLineal } from '../../../utilities/respuestas';
import { gamaRegresando } from '../../../utilities/colors';


@Component({
  selector: 'app-dashboard-overview',
  templateUrl: './dashboard-overview.component.html',
  styleUrls: ['./dashboard-overview.component.scss']
})
export class DashboardOverviewComponent implements OnInit, AfterViewInit {

  private AuthState: Observable<AuthState>;
  private today: moment.Moment;
  private aWeekAgo: moment.Moment;

  public userProfiles: UserProfile[];

  public currentFilters: Filter;
  public query: APIRequestParams;
  public totalGeneral: Observable<number>;
  public totalHoy: Observable<number>;
  public nuevosContactos: Observable<number>;
  public indiceSucursal: Observable<number>;
  public encuestasSucursalesError: string;
  public encuestasSucursalesData: number[] = [];
  public encuestasSucursalesLabels: string[] = [];
  public encuestasSucursalesLoading: Boolean;
  public historicoEncuestasLoading: Boolean;
  public historicoEncuestasError: string;
  public historicoEncuestasLabels: string[] = [];
  public historicoEncuestasData: any[] = [];
  public COLORS = gamaRegresando();

  constructor(private preguntas: PreguntasService, private store: Store<AppState>) { }

  ngOnInit() {
    this.AuthState = this.store.select<AppState>('MainStore')
      .distinctUntilKeyChanged('auth')
      .pluck<AuthState>('auth');

    this.AuthState
      .pluck<UserProfile[]>('currentUser', 'Profiles')
      .subscribe(profiles => this.userProfiles = profiles);

    this.today = moment();
    this.aWeekAgo = moment().subtract(7, 'days');
    this.currentFilters = {
      fechaInicio: this.aWeekAgo.format('DD/MM/YYYY'),
      fechaFin: this.today.format('DD/MM/YYYY')
    };
    this.query = {
      start: this.aWeekAgo.unix().toString(),
      end: moment().unix().toString(),
    };
  }
  ngAfterViewInit() {
    this.loadEncuestasSucursales(this.query);
    this.loadHistoricoEncuestas(this.query);
    this.loadResumen(this.query);
  }

  applyFilters(filter: Filter) {
    this.query = {
      start: moment(filter.fechaInicio, 'DD/MM/YYYY').unix().toString(),
      end: moment(filter.fechaFin, 'DD/MM/YYYY').hours(18).unix().toString()
    }

    this.loadEncuestasSucursales(this.query);
    this.loadHistoricoEncuestas(this.query);
    this.loadResumen(this.query);
  }

  loadEncuestasSucursales(query: APIRequestParams) {
    this.encuestasSucursalesLoading = true;
    this.encuestasSucursalesError = '';
    this.preguntas.getAll(query)
      .map(res => res['Preguntas'].reduce(mapPieChart, [[], []]))
      .subscribe(
      data => {
        if (data.length) {
          this.encuestasSucursalesLabels = data[0];
          this.encuestasSucursalesData = data[1];
          this.encuestasSucursalesLoading = false;
        } else {
          this.encuestasSucursalesLoading = false;
          this.encuestasSucursalesError = 'No se hay información en esa fecha';
        }
      },
      error => {
        this.encuestasSucursalesLoading = false;
        if (error.status === 401) {
          this.store.dispatch({ type: ActionTypes.LOGOUT_START });
        } else {
          this.encuestasSucursalesError = 'Error Cargando Total de Sucursales';
        }
      }
      );
  }

  loadHistoricoEncuestas(query: APIRequestParams) {
    this.historicoEncuestasLoading = true;
    this.historicoEncuestasError = '';

    this.preguntas.getTotalPorDia(query)
      .map(res => TotalPorDiaLineal(res['Encuestas']['TotalesxSucursalxDia'].sort((prev, curr) => {
        let mp = moment(prev.Fecha);
        let mc = moment(curr.Fecha);
        return mp.isSameOrAfter(mc) ? 1 : -1;
      })))
      .subscribe(
      data => {
        if (data[0].length) {
          this.historicoEncuestasLabels = data[0];
          this.historicoEncuestasData = data[1].sort((prev, curr) => prev.label > curr.label); // The API doesn't sort this response
          this.historicoEncuestasLoading = false;
        } else {
          this.historicoEncuestasLoading = false;
          this.historicoEncuestasError = 'No se hay información en esa fecha';
        }
      },
      error => {
        this.historicoEncuestasLoading = false;
        if (error.status === 401) {
          this.store.dispatch({ type: ActionTypes.LOGOUT_START });
        } else {
          this.historicoEncuestasError = 'Error Cargando Historico de Encuestas';
        }
      }
      );
  }

  loadResumen(query: APIRequestParams) {
    this.preguntas.getResumen(query)
      .map(res => res['Cabecera'])
      .subscribe(res => {
        console.log(res);
        this.totalHoy = Observable.of(res['TotalEncuestadosHoy']);
        this.totalGeneral = Observable.of(res['TotalEncuestas']);
        this.nuevosContactos = Observable.of(res['NuevosContactos']);
        this.indiceSucursal = Observable.of(res['IndiceSucursal']);
      });
  }
}
