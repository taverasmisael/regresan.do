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
import { merge, findByObjectId } from '@utilities/arrays';
import { ratingPalette, gamaRegresando } from '@utilities/colors';

import { APIRequestUser, APIRequestRespuesta, APIRequestParams } from '@models/apiparams';
import { AppState } from '@models/states/appstate';
import { BranchState } from '@models/states/branch';
import { HistoricEntry } from '@models/historic-entry';
import { OpenAnswer } from '@models/answer.open';
import { Pregunta } from '@models/pregunta';
import { CloseAnswer } from '@models/answer.close';
import { QuestionFilter } from '@models/filter-question';
import { StateRequest } from '@models/states/state-request';
import { UserProfile } from '@models/userprofile';
import { BranchChartData } from '@models/branch.chart-data';
import { ChartData } from '@models/chart-data';

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

  public activeBranch: BranchState
  public totalToday: BehaviorSubject<number>;
  public totalGeneral: BehaviorSubject<number>;
  public newContacts: BehaviorSubject<number>;
  public branchIndex: BehaviorSubject<number>;

  public chartData: BranchChartData;
  public branchColor: number;

  private store$: Observable<BranchState>
  public profiles$: Observable<UserProfile[]>

  private subCloseQs: Subscription
  private subOpeneQs: Subscription
  private subBranch: Subscription
  private subRoute: Subscription
  private subHistoric: Subscription
  private subCloseAw: Subscription

  constructor(private router: Router, private Preguntas: PreguntasService,
    private Respuestas: RespuestasService, KPIS: KpisService,
    private Store: Store<AppState>, private Route: ActivatedRoute) { }

  // Angular Lifecycle Hooks
  ngOnInit() {
    // This update the ActiveBranch on each StoreAction
    this.store$ = this.Store.select('MainStore')
      .distinctUntilKeyChanged('currentBranch')
      .pluck<BranchState>('currentBranch');

    this.chartData = new BranchChartData(new ChartData([], [], [gamaRegresando()[3]]), [], [])
    this.profiles$ = this.Store.select('MainStore')
      .pluck<UserProfile[]>('auth', 'currentUser', 'Profiles');

    this.InitializeSubscriptions();

    this.ResetResume();
  }

  ngAfterViewInit() {
    console.log('AfterViewInit...');
  }

  ngOnDestroy() {
    console.log('Destroying...');
    this.subCloseQs.unsubscribe();
    this.subOpeneQs.unsubscribe();
    this.subBranch.unsubscribe();
    this.subRoute.unsubscribe();
    this.subCloseAw.unsubscribe();
    this.Store.dispatch(new ResetAll());
  }

  // Public Methods
  public LoadCloseAnswer(pregunta: string) {
    const currentQuery = this.activeBranch.currentQuery;
    const query = updateObject(currentQuery, { pregunta });
    this.Store.dispatch(new RequestCloseAnswer(query, `Cargando Respuesta ${pregunta}`));
  }

  public LoadOpenAnswer(pregunta: string) {
    const currentQuery = this.activeBranch.currentQuery;
    const query = updateObject(currentQuery, { pregunta });
    this.Store.dispatch(new RequestOpenAnswer(query, `Cargando Respuesta ${pregunta}`));
  }

  public NavigateToBranch(profileId: number) {
    this.router.navigate(['../', profileId], {
      relativeTo: this.Route,
      preserveQueryParams: true,
      preserveFragment: true
    });
  }

  public LoadResumen() {
    const currentQuery = this.activeBranch.currentQuery;
    this.Preguntas.getResumenSucursal(currentQuery)
      .map(res => res['Cabecera'])
      .subscribe(res => {
        if (res) {
          this.totalToday.next(res['TotalEncuestadosHoy']);
          this.totalGeneral.next(res['TotalEncuestas']);
          this.newContacts.next(res['NuevosContactos']);
          this.branchIndex.next(res['IndiceSucursal']);
        } else {
          this.ResetResume();
        }

      });
  }

  public FetchQuestions() {
    const currentQuery = this.activeBranch.currentQuery;
    this.Store.dispatch(new RequestQuestions(currentQuery, 'Cargando Preguntas...'));
  }
  public FetchKPIs() {
    const currentQuery = this.activeBranch.currentQuery;
    this.Store.dispatch(new RequestKPI(currentQuery, 'Cargando KPIs..'));
  }
  public FetchStaffRanking() {
    const currentQuery = this.activeBranch.currentQuery;
    this.Store.dispatch(new RequestStaffRanking(currentQuery, 'Cargando Ranking de Personal...'));
  }
  public FetchHistoric() {
    const currentQuery = this.activeBranch.currentQuery;
    this.Store.dispatch(new RequestHistoric(currentQuery, 'Cargando Histórico de Encuestas...'));
  }

  public FetchAll() {
    this.FetchHistoric();
    this.FetchKPIs();
    this.FetchQuestions();
    this.FetchStaffRanking();
    this.LoadResumen();
  }

  // Public Helpers
  public GetRequesAnswerInfo(type: 'ACLOSE' | 'AOPEN', qid: number) {
    return findByObjectId(this.activeBranch.requests[type], qid.toString());
  }

  public GetAnswerDisplayData(type: 'ACLOSE' | 'AOPEN', question: string) {
    return findByObjectId(this.chartData[type], question);
  }

  public ApplyQueryParams(queryParams: Params) {
    const dispatch = (query: APIRequestParams) => this.Store.dispatch(new ApplyCurrentQuery(query));
    const navigate = (query: APIRequestParams) => this.router.navigate([], { queryParams: query });
    const dispatchNavigate = (query: APIRequestParams) => {
      dispatch(query);
      navigate(query);
      this.ResetButInfo();
      this.FetchAll();
    }
    const applyDefault = () => dispatchNavigate({ start: aWeekAgo, end: today })
    const applyPartial = (s?: string, e?: string) => {
      let start = s || moment.unix(+e).subtract(1, 'week').unix().toString();
      let end = e || moment.unix(+s).add(1, 'week').unix().toString();
      dispatchNavigate({ start, end });
    }
    const DateFilter = {
      exists: (params) => params['start'] && params['end'],
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

  // Private Methods

  private InitializeSubscriptions() {
    this.subBranch = this.store$.subscribe((branch) => this.activeBranch = branch);

    // Load all CloseAnswer each time there are new closeQuestions
    this.subCloseQs = this.store$.distinctUntilKeyChanged('closeQuestions')
      .pluck<Pregunta[]>('closeQuestions').filter(qs => Boolean(qs.length))
      .map(qs => qs.map(q => q.idPregunta))
      .subscribe(questionsId =>
        questionsId.forEach(id => this.LoadCloseAnswer(id.toString()))
      );

    // Load all OpenAnswer each time there are new openQuestions
    this.subOpeneQs = this.store$.distinctUntilKeyChanged('openQuestions')
      .pluck<Pregunta[]>('openQuestions').filter(qs => Boolean(qs.length))
      .map(qs => qs.map(q => q.idPregunta))
      .subscribe(questionsId =>
        questionsId.forEach(id => this.LoadOpenAnswer(id.toString()))
      );

    this.subCloseAw = this.store$.distinctUntilKeyChanged('closeAnswers')
      .pluck<CloseAnswer[]>('closeAnswers').filter(aws => Boolean(aws.length))
      .map(aws => [aws[aws.length - 1]])
      .map(aws => aws.map(makePieChart).reduce(merge, []))
      .subscribe(answers => this.SaveCloseAnswers(answers));

    this.subHistoric = this.store$.distinctUntilKeyChanged('historicData')
      .pluck<HistoricEntry[]>('historicData').filter(entries => Boolean(entries.length))
      .map(TotalPorDiaLineal)
      .subscribe((processedEntries) => this.SaveHistoricEntries(processedEntries));

    // Get the Route Params
    this.subRoute = this.Route.params.distinctUntilKeyChanged('id')
      .switchMap(
      (params) =>
        this.profiles$.map(profiles => // Retrieve The Current Branch from the UserProfile List
          profiles ? profiles.find(prof => prof.OldProfileId === +params['id']) : undefined)
      )
      .filter(info => info && !compare(info, this.activeBranch.info)) // Security Measures Prevents Infinite Loop
      .do((info) => this.branchColor = +info.OldProfileId.toString().split('')[0] + +info.OldProfileId.toString().split('')[1])
      .do(() => this.ResetView()) // Clean up the State and let only the info
      .do((info) => this.Store.dispatch(new SaveInfo(info))) // We save this info and then...
      .switchMap(val => this.Route.queryParams) // ... We switch to our queryParams to
      .subscribe((info) => this.ApplyQueryParams(info)); // Finally we apply the query
  }

  // Private Helpers

  private ResetView() {
    this.ResetResume();
    this.Store.dispatch(new ResetAll());
    this.chartData = new BranchChartData(new ChartData([], [], []), [], []);
  }

  private ResetButInfo() {
    this.ResetResume();
    this.Store.dispatch(new ResetButInfo());
    this.chartData = new BranchChartData(new ChartData([], [], []), [], []);
  }

  private ResetResume() {
    this.totalToday = new BehaviorSubject(0);
    this.totalGeneral = new BehaviorSubject(0);
    this.newContacts = new BehaviorSubject(0);
    this.branchIndex = new BehaviorSubject(0);
  }

  private SaveHistoricEntries(entries: any[]) {
    this.chartData = updateObject(this.chartData, {
      historic: {
        colors: [gamaRegresando()[this.branchColor]],
        data: entries[1].sort((prev, curr) => prev.label > curr.label),
        labels: entries[0],
      }
    });
  }

  private SaveCloseAnswers(entries: ChartData[]) {
    this.chartData = updateObject(this.chartData, {
      ACLOSE: [...this.chartData.ACLOSE, entries[0]]
    })
  }
}
