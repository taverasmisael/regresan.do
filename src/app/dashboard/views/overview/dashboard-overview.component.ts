import { Component, OnInit, AfterViewInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { ActionTypes } from '../../../actions/auth.actions';

import { UserProfile } from '../../../models/userprofile';
import { AppState } from '../../../models/appstate';
import { AuthState } from '../../../models/authstate';
import { APIRequestParams } from '../../../models/apiparams';
import { Filter } from '../../../models/toolbar-flters';

import * as moment from 'moment';
import { PreguntasService } from '../../../services/preguntas.service';

import { merge, sum } from '../../../utilities/arrays';
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

  public userProfiles: UserProfile[];

  public totalGeneral: number;
  public totalHoy: number;
  public encuestasSucursalesError: string;
  public encuestasSucursalesData: number[] = [];
  public encuestasSucursalesLabels: string[] = [];
  public encuestasSucursalesLoading: Boolean;
  public historicoEncuestasLoading: Boolean;
  public historicoEncuestasError: string;
  public historicoEncuestasLabels: string[] = [];
  public historicoEncuestasData: any[] = [];
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
    let query = {
      start: this.aWeekAgo.unix().toString(),
      end: moment().unix().toString(),
    };
    this.loadEncuestasSucursales(query);
    this.loadHistoricoEncuestas(query);
  }

  applyFilters(filter: Filter) {
    let query: APIRequestParams = {
      start: moment(filter.fechaInicio, 'DD/MM/YYYY').unix().toString(),
      end: moment(filter.fechaFin, 'DD/MM/YYYY').unix().toString()
    }

    this.loadEncuestasSucursales(query);
    this.loadHistoricoEncuestas(query);
  }

  loadEncuestasSucursales(query: APIRequestParams) {
    this.encuestasSucursalesLoading = true;
    this.preguntas.getAll(query)
      .map(res => res['Preguntas'].reduce(mapPieChart, [[], []]))
      .subscribe(
      data => {
        this.encuestasSucursalesLabels = data[0];
        this.encuestasSucursalesData = data[1];
        this.encuestasSucursalesLoading = false;
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

    this.preguntas.getTotalPorDia(query)
      .map(res => TotalPorDiaLineal(res['Encuestas']['TotalesxSucursalxDia']))
      .subscribe(
      data => {
        this.historicoEncuestasLabels = data[0];
        this.historicoEncuestasData = data[1].sort((prev, curr) => prev.label > curr.label); // The API doesn't sort this response
        this.totalHoy = 35; // Este # es feik como el que manda la API
        this.totalGeneral = data[1]
          .map(ob => ob.data) // We only want the data array
          .reduce(merge, []) // ... but in a single array
          .reduce(sum, 0) // now we sum values
        this.historicoEncuestasLoading = false;
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
}
