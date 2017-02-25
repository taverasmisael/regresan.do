import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Actions, Effect } from '@ngrx/effects';

import { AppState } from '@models/states/appstate';
import { APIRequestParams, APIRequestUser } from '@models/apiparams';
import { UserProfile } from '@models/userprofile';
import { BranchState } from '@models/states/branch';
import { HistoricEntry } from '@models/historic-entry';
import { KPI } from '@models/kpi';
import { OpenAnswer } from '@models/answer.open';
import { Pregunta } from '@models/pregunta';
import { StaffRanking } from '@models/staff-ranking';

import { KpisService } from '@services/kpis.service';
import { PreguntasService } from '@services/preguntas.service';
import { RespuestasService } from '@services/respuestas.service';
import { StaffService } from '@services/staff.service';

import { sortResDate } from '@utilities/arrays';

import * as ACTIONS from '@actions/branch.types';
import { ActionTypes as AuthTypes } from '@actions/auth.actions';

import {
  ErrorCloseAnswer, ErrorHistoric, ErrorKPI, ErrorOpenAnswer, ErrorQuestions, ErrorStaffRanking,
  SuccessCloseAnswer, SuccessHistoric, SuccessKPI, SuccessOpenAnswer, SuccessQuestions, SuccessStaffRanking,
  SaveCurrentQuery
} from '@actions/branch.actions';

@Injectable()
export class BranchEffects {
  @Effect() requestCA$ = this.actions$
    .ofType(ACTIONS.BRANCH_REQ_ACLOSE_R)
    .map(action => action.payload)
    .mergeMap(payload => {
      return this.respuestasService.getFromProfile(payload)
        .map<Pregunta[]>(res => res['RespuestasPreguntas']) // return only the real data
        .map(answer => new SuccessCloseAnswer({answer: answer, question: payload.pregunta}))
        .catch(err => this.HandleError(err, ErrorCloseAnswer));
    });

  @Effect() requestHistoric$ = this.actions$
    .ofType(ACTIONS.BRANCH_REQ_HISTORIC_R)
    .map(action => action.payload)
    .switchMap(payload => {
      return this.preguntasService.getTotalPorDia(payload)
        .map<HistoricEntry[]>(res => res['Encuestas']['TotalesxSucursalxDia'].sort(sortResDate))
        .map(entries => entries.filter(entry => entry.Sucursal === this.currentBranch.Title)) // return only data of currentBranch
        .map(entries => new SuccessHistoric(entries))
        .catch(err => this.HandleError(err, ErrorHistoric));
    });

  @Effect() requestKPI$ = this.actions$
    .ofType(ACTIONS.BRANCH_REQ_KPI_R)
    .map(action => action.payload)
    .switchMap(payload => {
      return this.kpiService.getFromProfile(payload)
        .map<KPI[]>(res => res['Kpis'])
        .map(kpis => new SuccessKPI(kpis))
        .catch(err => this.HandleError(err, ErrorKPI));
    });

  @Effect() requestOA$ = this.actions$
    .ofType(ACTIONS.BRANCH_REQ_AOPEN_R)
    .map(action => action.payload)
    .mergeMap(payload => {
      return this.respuestasService.getAbiertasFromProfile(payload)
        .map<OpenAnswer[]>(res => res['RespuestasPreguntas'])
        .map(answer => new SuccessOpenAnswer({answer: answer, question: payload.pregunta}))
        .catch(err => this.HandleError(err, ErrorOpenAnswer));
    })

  @Effect() requestQS$ = this.actions$
    .ofType(ACTIONS.BRANCH_REQ_QUESTIONS_R)
    .map(action => action.payload)
    .switchMap(payload => { // Trying Some Different RXJS operator
      return this.preguntasService.getAllByProfile(payload)
        .map<Pregunta[]>(res => res['Respuestas']) // return only the real data
        .map(questions => {
          const close = questions.filter(q => q.tipoPregunta !== 'Abierta');
          const open = questions.filter(q => q.tipoPregunta === 'Abierta');
          return new SuccessQuestions({ close, open })
        })
        .catch(err => this.HandleError(err, ErrorQuestions));
    });

  @Effect() requestStaff$ = this.actions$
    .ofType(ACTIONS.BRANCH_REQ_STAFF_RANKING_R)
    .map(action => action.payload)
    .switchMap(payload => {
      return this.staffService.getKpisCamareros(payload)
        .map<StaffRanking[]>(res => res['Camareros'].sort((prev, curr) => prev.Total > curr.Total))
        .map(ranking => new SuccessStaffRanking(ranking))
        .catch(err => this.HandleError(err, ErrorStaffRanking));
    });

  @Effect() applyQuery$ = this.actions$
    .ofType(ACTIONS.BRANCH_APPLY_CURRENT_QUERY)
    .map(action => action.payload)
    .map(payload => ({
      profile: this.currentBranch.OldProfileId.toString(),
      start: payload.start,
      end: payload.end
    }))
    .switchMap(query => {
      return Observable.of(new SaveCurrentQuery(query))
    })

  public currentBranch: UserProfile;
  constructor(private actions$: Actions,
    private kpiService: KpisService,
    private preguntasService: PreguntasService,
    private respuestasService: RespuestasService,
    private staffService: StaffService,
    private store: Store<AppState>) {
      this.store.select('MainStore')
        .pluck('currentSucursal')
        .distinctUntilKeyChanged('info')
        .pluck<UserProfile>('info')
        .subscribe(val =>  this.currentBranch = val);
    }

  private HandleError(error: any, Action: any): Observable<any> {
    if (error.status === 401) {
      return Observable.of({ type: AuthTypes.LOGOUT_START });
    } else {
      return Observable.of(new Action(error));
    }
  }
}
