import { Component, OnInit, AfterViewInit, OnDestroy, EventEmitter } from '@angular/core';
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
import { APIRequestUser, APIRequestRespuesta } from '@models/apiparams';
import { QuestionFilter } from '@models/filter-question';
import { UserProfile } from '@models/userprofile';

import {
  SaveInfo, ResetButInfo, RequestCloseAnswer, RequestHistoric, RequestKPI,
  RequestOpenAnswer, RequestQuestions, RequestStaffRanking, ApplyCurrentQuery
} from '@actions/branch.actions';

@Component({
  selector: 'app-sucursales-details',
  templateUrl: './sucursales-details.component.html',
  styleUrls: ['./sucursales-details.component.scss'],
})
export class SucursalesDetailsComponent implements OnInit, AfterViewInit, OnDestroy {

  public ActiveBranch: BranchState;

  private FetchQuestions: EventEmitter<any>;
  private FetchKPIs: EventEmitter<any>;
  private FetchStaffRanking: EventEmitter<any>;
  private FetchHistoric: EventEmitter<any>;
  private LoadCases: any;
  private store$: Observable<BranchState>;

  constructor(private router: Router, private Preguntas: PreguntasService,
    private Respuestas: RespuestasService, KPIS: KpisService,
    private Store: Store<AppState>, private Route: ActivatedRoute) { }

  // Angular Lifecycle Hooks
  ngOnInit() {
    this.FetchQuestions = new EventEmitter();
    this.FetchKPIs = new EventEmitter();
    this.FetchStaffRanking = new EventEmitter();
    this.FetchHistoric = new EventEmitter();
    this.FetchQuestions.subscribe(($event) => this.OnFetchQuestions($event));
    this.FetchKPIs.subscribe(($event) => this.OnFetchKPIs($event));
    this.FetchStaffRanking.subscribe(($event) => this.OnFetchStaffRanking($event));
    this.FetchHistoric.subscribe(($event) => this.OnFetchHistoric($event));

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
      (params: Params) =>
        profiles$.map(profiles => // Retrieve The Current Branch from the UserProfile List
          profiles.find(prof => prof.OldProfileId === +params['id']))
      )
      .filter(info => info && !compare(info, this.ActiveBranch.info)) // Security Measures Prevents Infinite Loop
      .do(info => this.Store.dispatch(new SaveInfo(info)))
      .switchMap(val => {
        return this.Route.queryParams;
      })
      .subscribe(
      (info) => {
        if (compare(info, {})) {
          const query = {
            start: moment().subtract(1, 'week').unix().toString(),
            end: moment().unix().toString(),
          }
          this.Store.dispatch(new ApplyCurrentQuery(query));
          this.router.navigate([], {
            queryParams: query
          });
        }
      }
      );

    // Get the Route query
  }

  ngAfterViewInit() {
    console.log('AfterViewInit...');
  }

  ngOnDestroy() {
    console.log('Destroying...');
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
  private OnFetchQuestions(event) {
    const currentQuery = this.ActiveBranch.currentQuery;
    this.Store.dispatch(new RequestQuestions(currentQuery, 'Cargando Preguntas...'));
  }
  private OnFetchKPIs(event) {
    const currentQuery = this.ActiveBranch.currentQuery;
    this.Store.dispatch(new RequestKPI(currentQuery, 'Cargando KPIs..'));
  }
  private OnFetchStaffRanking(event) {
    const currentQuery = this.ActiveBranch.currentQuery;
    this.Store.dispatch(new RequestStaffRanking(currentQuery, 'Cargando Ranking de Personal...'));
  }
  private OnFetchHistoric(event) {
    const currentQuery = this.ActiveBranch.currentQuery;
    this.Store.dispatch(new RequestHistoric(currentQuery, 'Cargando Histórico de Encuestas...'));
  }
}

type ErrorTypes = 'QUESTIONS' | 'OPENANSWER' | 'CLOSEANSWER';
