import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import * as moment from 'moment';

import compare from 'just-compare';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ActionTypes as AuthActions } from '@actions/auth.actions';

import { PreguntasService } from '@services/preguntas.service';
import { RespuestasService } from '@services/respuestas.service';
import { KpisService } from '@services/kpis.service';

import { makePieChart, TotalPorDiaLineal } from '@utilities/respuestas';
import { updateObject } from '@utilities/objects';
import { merge } from '@utilities/arrays';
import { ratingPalette, gamaRegresando } from '@utilities/colors';

import { AppState } from '@models/states/appstate';
import { BranchState } from '@models/states/branch';
import { Pregunta } from '@models/pregunta';
import { OpenAnswer } from '@models/answer.open';
import { APIRequestUser, APIRequestRespuesta, APIRequestParams } from '@models/apiparams';
import { QuestionFilter } from '@models/filter-question';
import { UserProfile } from '@models/userprofile';

import {
  SaveInfo, ResetButInfo, ResetAll, RequestCloseAnswer, RequestHistoric, RequestKPI,
  RequestOpenAnswer, RequestQuestions, RequestStaffRanking, ApplyCurrentQuery,
} from '@actions/branch.actions';

const aWeekAgo = moment().subtract(1, 'week').unix().toString();
const today = moment().unix().toString();

@Component({
  selector: 'app-sucursales-details',
  templateUrl: './sucursales-details.component.html',
  styleUrls: ['./sucursales-details.component.scss'],
})
export class SucursalesDetailsComponent implements OnInit, AfterViewInit, OnDestroy {

  public ActiveBranch: BranchState;
  private store$: Observable<BranchState>;

  constructor(private router: Router, private Preguntas: PreguntasService,
    private Respuestas: RespuestasService, KPIS: KpisService,
    private Store: Store<AppState>, private Route: ActivatedRoute) { }

  // Angular Lifecycle Hooks
  ngOnInit() {
    // This update the ActiveBranch on each StoreAction
    this.store$ = this.Store.select('MainStore')
      .distinctUntilKeyChanged('currentSucursal')
      .pluck<BranchState>('currentSucursal');

    this.store$.subscribe((branch) => this.ActiveBranch = branch);

    // Load all CloseAnswer each time there are new closeQuestions
    this.store$.distinctUntilKeyChanged('closeQuestions')
      .pluck<Pregunta[]>('closeQuestions').filter(qs => Boolean(qs.length))
      .map(qs => qs.map(q => q.idPregunta))
      .subscribe(questionsId =>
        questionsId.forEach(id => this.loadCloseAnswer(id.toString()))
      );

    // Load all OpenAnswer each time there are new openQuestions
    this.store$.distinctUntilKeyChanged('openQuestions')
      .pluck<Pregunta[]>('openQuestions').filter(qs => Boolean(qs.length))
      .map(qs => qs.map(q => q.idPregunta))
      .subscribe(questionsId =>
        questionsId.forEach(id => this.loadOpenAnswer(id.toString()))
      );


    const profiles$ = this.Store.select('MainStore')
      .pluck<UserProfile[]>('auth', 'currentUser', 'Profiles');

    // Get the Route Params
    this.Route.params.distinctUntilKeyChanged('id')
      .switchMap(
      (params) =>
        profiles$.map(profiles => // Retrieve The Current Branch from the UserProfile List
          profiles.find(prof => prof.OldProfileId === +params['id']))
      )
      .filter(info => info && !compare(info, this.ActiveBranch.info)) // Security Measures Prevents Infinite Loop
      .do(() => this.Store.dispatch(new ResetAll())) // Clean up the State and let only the info
      .do(info => this.Store.dispatch(new SaveInfo(info))) // We save this info and then...
      .switchMap(val => this.Route.queryParams) // ... We switch to our queryParams to
      .subscribe((info) => this.ApplyQueryParams(info)); // Finally we apply the query

    // Get the Route query
  }

  ngAfterViewInit() {
    console.log('AfterViewInit...');
  }

  ngOnDestroy() {
    console.log('Destroying...');
    this.Store.dispatch(new ResetAll());
  }

  // Public Methods
  public loadCloseAnswer(pregunta: string) {
    const currentQuery = this.ActiveBranch.currentQuery;
    const query = updateObject(currentQuery, { pregunta });
    this.Store.dispatch(new RequestCloseAnswer(query, `Cargando Respuesta ${pregunta}`));
  }

  public loadOpenAnswer(pregunta: string) {
    const currentQuery = this.ActiveBranch.currentQuery;
    const query = updateObject(currentQuery, { pregunta });
    this.Store.dispatch(new RequestOpenAnswer(query, `Cargando Respuesta ${pregunta}`));
  }


  // Private Methods
  private FetchQuestions() {
    const currentQuery = this.ActiveBranch.currentQuery;
    console.log(currentQuery)
    this.Store.dispatch(new RequestQuestions(currentQuery, 'Cargando Preguntas...'));
  }
  private FetchKPIs() {
    const currentQuery = this.ActiveBranch.currentQuery;
    this.Store.dispatch(new RequestKPI(currentQuery, 'Cargando KPIs..'));
  }
  private FetchStaffRanking() {
    const currentQuery = this.ActiveBranch.currentQuery;
    this.Store.dispatch(new RequestStaffRanking(currentQuery, 'Cargando Ranking de Personal...'));
  }
  private FetchHistoric() {
    const currentQuery = this.ActiveBranch.currentQuery;
    this.Store.dispatch(new RequestHistoric(currentQuery, 'Cargando Histórico de Encuestas...'));
  }

  // Private Helpers
  public ApplyQueryParams(queryParams: Params) {
    const dispatch = (query: APIRequestParams) => this.Store.dispatch(new ApplyCurrentQuery(query));
    const navigate = (query: APIRequestParams) => this.router.navigate([], { queryParams: query });
    const dispatchNavigate = (query: APIRequestParams) => {
      this.Store.dispatch(new ResetButInfo()); // UNCOMMITED:
      dispatch(query);
      navigate(query);
      this.FetchQuestions();
    }
    const applyDefault = () => dispatchNavigate({ start: aWeekAgo, end: today })
    const applyPartial = (s?: string, e?: string) => {
      let start = s || moment.unix(+e).subtract(1, 'week').unix().toString();
      let end = e || moment.unix(+s).add(1, 'week').unix().toString();
      dispatchNavigate({ start, end });
    }
    const DateFilter = {
      exists: (params) => params['start']  && params['end'],
      areNumeric: (params) => +params['start'] && +params['end'],
      isNumeric: (slice: string, params) => +params[slice]
    }
    if (compare(queryParams, {})) {
      applyDefault();
    } else if (!DateFilter.exists(queryParams)) { // If there's not an DateFilter applyed
      applyDefault();
    } else if (!DateFilter.areNumeric(queryParams)) {
      applyDefault();
    } else if (DateFilter.areNumeric(queryParams)) {
      applyPartial(queryParams['start'], queryParams['end'])
    } else if (DateFilter.isNumeric('start', queryParams) && !DateFilter.isNumeric('end', queryParams)) {
      applyPartial(queryParams['start']);
    } else if (!DateFilter.isNumeric('start', queryParams) && DateFilter.isNumeric('end', queryParams)) {
      applyPartial(undefined, queryParams['end']);
    }
  }
}
