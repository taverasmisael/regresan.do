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
  SaveInfo, ResetButInfo,
  RequestCloseQuestion, RequestCloseAnswer, RequestOpenQuestion, RequestOpenAnswer,
  ErrorCloseQuestion, ErrorCloseAnswer, ErrorOpenQuestion, ErrorOpenAnswer,
  SuccessCloseQuestion, SuccessCloseAnswer, SuccessOpenQuestion, SuccessOpenAnswer
} from '@actions/branch.actions';

@Component({
  selector: 'app-sucursales-details',
  templateUrl: './sucursales-details.component.html',
  styleUrls: ['./sucursales-details.component.scss'],
})
export class SucursalesDetailsComponent implements OnInit, AfterViewInit, OnDestroy {

  public ActiveBranch: BranchState;

  private FetchInformation: EventEmitter<any>;
  private LoadCases: any;
  private MockQuery: QuestionFilter;

  constructor(private Preguntas: PreguntasService,
    private Respuestas: RespuestasService, KPIS: KpisService,
    private Store: Store<AppState>, private Route: ActivatedRoute) { }

  // Angular Lifecycle Hooks
  ngOnInit() {
    this.LoadCases = {
      ALL: 'ALL',
      OPEN: 'OPEN',
      CLOSE: 'CLOSE',
      KPIS: 'KPIS',
      STAFF: 'STAFF',
      HISTORIC: 'HISTORIC'
    };
    this.MockQuery = {
      start: moment().subtract(7, 'days').unix().toString(),
      end: moment().unix().toString(),
      profile: 'MOCK'
    };
    this.FetchInformation = new EventEmitter();
    this.FetchInformation.subscribe(($event) => this.OnFetchInformation($event));

    // This update the ActiveBranch on each StoreAction
    this.Store.select('MainStore')
      .distinctUntilKeyChanged('currentSucursal')
      .pluck<BranchState>('currentSucursal').subscribe((branch) => {
        this.ActiveBranch = branch;
      });


    const profiles$ = this.Store.select('MainStore')
      .pluck<UserProfile[]>('auth', 'currentUser', 'Profiles');

    // Get the Route Params
    this.Route.params.distinctUntilKeyChanged('id')
      .switchMap(
      (params: Params) =>
        profiles$.map(profiles => // Retrieve The Current Branch from the UserProfile List
          profiles.find(prof => prof.OldProfileId === +params['id']))
      ).subscribe(
      (res) => {
        if (!compare(res, this.ActiveBranch.info)) { // Security Measures Prevents Infinite Loop
          this.Store.dispatch(new SaveInfo(res));
          this.FetchInformation.emit(this.LoadCases.OPEN);
        }
      },
      (error) => console.log(error)
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
  public requestOpenAnswer(id: string) {
    // TODO: use `this.ActiveBranch.filters.question` instead of MockQuery
    const query = updateObject(this.MockQuery, { pregunta: id });
    return this.Respuestas.getAbiertasFromProfile(query)
      .map<OpenAnswer[]>(res => res['RespuestasPreguntas']).toPromise();
  }


  // Private Methods
  private LoadQuestions(query: APIRequestUser) {
    this.Store.dispatch(new RequestOpenQuestion('Cargando Preguntas Abiertas...'));
    this.Store.dispatch(new RequestCloseQuestion('Cargando Preguntas Cerradas...'));

    return this.Preguntas.getAllByProfile(query)
      .map<Pregunta[]>(res => res['Respuestas']).toPromise();
  }

  private LoadOpenAnswers(questions: Pregunta[]) {
    this.Store.dispatch(new RequestOpenAnswer('Cargando Respuestas Abiertas...'))
    const answersArray = questions.map((question) =>
      this.requestOpenAnswer(question.idPregunta.toString())
    );
    return Promise.all(answersArray)
      .then((answers: OpenAnswer[][]) => {
        return this.Store.dispatch(new SuccessOpenAnswer(answers.reduce(merge)));
      });
  }
  private OnFetchInformation(event) {
    this.MockQuery = updateObject(this.MockQuery, { profile: this.ActiveBranch.info.OldProfileId.toString() });
    switch (event) {
      case this.LoadCases.OPEN:
        this.LoadQuestions(this.MockQuery)
          .then((questions) => {
            this.SaveQuestions(questions)
            this.LoadOpenAnswers(this.ActiveBranch.openQuestions)
            .catch((err) => this.HandleRequestError('OPENANSWER', err));
          })
          .catch((err) => this.HandleRequestError('QUESTIONS', err));
        break;
      case this.LoadCases.CLOSE:
        console.log('Calling Close Data...'); // TODO: Implement
        break;
      case this.LoadCases.KPIS:
        console.log('Calling KPIS...'); // TODO: Implement
        break;
      case this.LoadCases.STAFF:
        console.log('Calling STAFF...'); // TODO: Implement
        break;
      case this.LoadCases.HISTORIC:
        console.log('Calling Historic...'); // TODO: Implement
        break;
      default:
        this.Store.dispatch(new ResetButInfo());
        console.log('Calling All'); // Todo: Implmenet
        break;
    }
  }

  private SaveQuestions(questions: Pregunta[]) {
    const close = questions.filter(q => q.tipoPregunta !== 'Abierta');
    const open = questions.filter(q => q.tipoPregunta === 'Abierta');

    this.Store.dispatch(new SuccessOpenQuestion(open));
    this.Store.dispatch(new SuccessCloseQuestion(close));
    return questions;
  }

  private HandleRequestError(type: ErrorTypes, error?: any) {
    if (error.status === 401) {
      this.Store.dispatch({ type: AuthActions.LOGOUT_START });
      return;
    } else {
      switch (type) {
        case 'QUESTIONS':
            this.Store.dispatch(new ErrorCloseQuestion(error));
            this.Store.dispatch(new ErrorOpenQuestion(error));
          break;
        case 'OPENANSWER':
          this.Store.dispatch(new ErrorOpenAnswer(error));
          break;
        case 'CLOSEANSWER':
          this.Store.dispatch(new ErrorCloseAnswer(error));
          break;
        default:
          break;
      }
    }
    return;
  }
}

type ErrorTypes = 'QUESTIONS' | 'OPENANSWER' | 'CLOSEANSWER';
