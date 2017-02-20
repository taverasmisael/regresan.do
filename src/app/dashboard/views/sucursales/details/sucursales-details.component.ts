import { Component, OnInit, AfterViewInit, OnDestroy, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import * as moment from 'moment';

import compare from 'just-compare';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

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
import { APIRequestUser, APIRequestRespuesta } from '@models/apiparams';
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
      this.FetchInformation = new EventEmitter();
      this.FetchInformation.subscribe(($event) => this.onFetchInformation($event));

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
        (res) =>  {
          if (!compare(res, this.ActiveBranch.info)) { // Security Measures Prevents Infinite Loop
            this.Store.dispatch(new SaveInfo(res));
            this.FetchInformation.emit(this.LoadCases.OPEN);
          }
        },
        (error) => console.log(error)
      );

      // Get the Route query
      this.Route.queryParams.subscribe(
        (res) =>  console.log(res),
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


    // Private Methods
    private LoadQuestions(query: APIRequestUser) {
      this.Store.dispatch(new RequestOpenQuestion('Cargando Preguntas Abiertas...'));
      this.Store.dispatch(new RequestCloseQuestion('Cargando Preguntas Cerradas...'));

      return this.Preguntas.getAllByProfile(query)
      .map<Pregunta[]>(res => res['Respuestas']).toPromise()
        .then(questions => {
          const close = questions.filter(q => q.tipoPregunta !== 'Abierta');
          const open = questions.filter(q => q.tipoPregunta === 'Abierta');

          this.Store.dispatch(new SuccessOpenQuestion(open));
          this.Store.dispatch(new SuccessCloseQuestion(close));
          return questions;
        })
        .catch((err) => {
          this.Store.dispatch(new ErrorOpenQuestion(err));
          this.Store.dispatch(new ErrorCloseQuestion(err));
        });
    }

    private LoadOpenAnswers(questions: Pregunta[]) {
      console.log(questions);
    }
    private onFetchInformation(event) {
      const mockQuery = {
        start: moment().subtract(7, 'days').unix().toString(),
        end: moment().unix().toString(),
        profile: this.ActiveBranch.info.OldProfileId.toString()
      };
      switch (event) {
        case this.LoadCases.OPEN:
          console.log('Calling Open Data...');
          this.LoadQuestions(mockQuery)
            .then(this.LoadOpenAnswers);
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
}
