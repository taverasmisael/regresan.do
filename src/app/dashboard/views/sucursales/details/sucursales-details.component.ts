import { Component, OnInit, AfterViewInit, OnDestroy, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

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
  RequestOpenAnswer, RequestQuestions, RequestStaffRanking
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
  private MockQuery: QuestionFilter;
  private store$: Observable<BranchState>;

  constructor(private Preguntas: PreguntasService,
    private Respuestas: RespuestasService, KPIS: KpisService,
    private Store: Store<AppState>, private Route: ActivatedRoute) { }

  // Angular Lifecycle Hooks
  ngOnInit() {
    this.MockQuery = { // TODO: Replace with the real query
      start: moment().subtract(7, 'days').unix().toString(),
      end: moment().unix().toString(),
      profile: 'MOCK'
    };
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
      .filter(info => !compare(info, this.ActiveBranch.info)) // Security Measures Prevents Infinite Loop
      .subscribe(
        (info) => {
          this.Store.dispatch(new SaveInfo(info));
          this.FetchQuestions.emit();
          this.FetchKPIs.emit();
          this.FetchStaffRanking.emit();
          this.FetchHistoric.emit();
        }
      );

    // Get the Route query
    this.Route.queryParams.subscribe(
      (res) => console.log(res),
      (err) => console.error(err),
      () => console.log('Done!')
    );
  }

  ngAfterViewInit() {
    console.log('AfterViewInit...');
  }

  ngOnDestroy() {
    console.log('Destroying...');
  }

  // Public Methods
  public loadCloseAnswer(pregunta: string) {
    // TODO: Replace with the real query
    const query = updateObject(this.MockQuery, {pregunta});
    this.Store.dispatch(new RequestCloseAnswer(query, `Cargando Respuesta ${pregunta}`));
  }

  public loadOpenAnswer(pregunta: string) {
    // TODO: Replace with the real query
    const query = updateObject(this.MockQuery, {pregunta});
    this.Store.dispatch(new RequestOpenAnswer(query, `Cargando Respuesta ${pregunta}`));
  }


  // Private Methods
  private OnFetchQuestions(event) {
    // TODO: Replace with the real query
    this.MockQuery = updateObject(this.MockQuery, { profile: this.ActiveBranch.info.OldProfileId.toString() });
    this.Store.dispatch(new RequestQuestions(this.MockQuery, 'Cargando Preguntas...'));
  }
  private OnFetchKPIs(event) {
    // TODO: Replace with the real query
    this.MockQuery = updateObject(this.MockQuery, { profile: this.ActiveBranch.info.OldProfileId.toString() });
    this.Store.dispatch(new RequestKPI(this.MockQuery, 'Cargando KPIs..'));
  }
  private OnFetchStaffRanking(event) {
    // TODO: Replace with the real query
    this.MockQuery = updateObject(this.MockQuery, { profile: this.ActiveBranch.info.OldProfileId.toString() });
    this.Store.dispatch(new RequestStaffRanking(this.MockQuery, 'Cargando Ranking de Personal...'));
  }
  private OnFetchHistoric(event) {
    // TODO: Replace with the real query
    this.MockQuery = updateObject(this.MockQuery, { profile: this.ActiveBranch.info.OldProfileId.toString() });
    this.Store.dispatch(new RequestHistoric(this.MockQuery, 'Cargando Histórico de Encuestas...'));
  }
}

type ErrorTypes = 'QUESTIONS' | 'OPENANSWER' | 'CLOSEANSWER';
