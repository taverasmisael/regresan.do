import { Injectable } from '@angular/core'

import { Store } from '@ngrx/store'
import { Observable } from 'rxjs/Observable'
import { Actions, Effect } from '@ngrx/effects'

import { AppState } from '@models/states/app'
import { UserProfile } from '@models/userProfile'
import { CloseAnswer } from '@models/closeAnswer'
import { BranchState } from '@models/states/branch'
import { HistoricEntry } from '@models/historicEntry'
import { KPI } from '@models/kpi'
import { OpenAnswer } from '@models/openAnswer'
import { Question } from '@models/question'
import { StaffRanking } from '@models/staffRanking'

import { KpisService } from '@services/kpis.service'
import { QuestionsService } from '@services/preguntas.service'
import { RespuestasService } from '@services/respuestas.service'
import { StaffService } from '@services/staff.service'

import { sortResDate } from '@utilities/arrays'

import * as ACTIONS from '@actions/branch.types'
import { ActionTypes as AuthTypes } from '@actions/auth.actions'

import {
  ErrorCloseAnswer,
  ErrorFilteredQuestions,
  ErrorHistoric,
  ErrorKPI,
  ErrorOpenAnswer,
  ErrorQuestions,
  ErrorStaffRanking,
  SuccessCloseAnswer,
  SuccessFilteredQuestions,
  SuccessHistoric,
  SuccessKPI,
  SuccessOpenAnswer,
  SuccessQuestions,
  SuccessStaffRanking,
  SaveCurrentQuery
} from '@actions/branch.actions'

@Injectable()
export class BranchEffects {
  @Effect()
  requestCA$ = this.actions$
    .ofType(ACTIONS.BRANCH_REQ_ACLOSE_R)
    .map(action => action['payload'])
    .mergeMap(payload => {
      return this.respuestasService
        .getFromProfile(payload)
        .map(res => res['RespuestasPreguntas']) // return only the real data
        .map(
          (answer: CloseAnswer[]) =>
            new SuccessCloseAnswer({ answer: answer, question: payload.pregunta })
        )
        .catch(err => this.HandleError(err, ErrorCloseAnswer))
    })

  @Effect()
  requestHistoric$ = this.actions$
    .ofType(ACTIONS.BRANCH_REQ_HISTORIC_R)
    .map(action => action['payload'])
    .switchMap(payload => {
      return this.preguntasService
        .getTotalPorDia(payload)
        .map(res => res['Encuestas']['TotalesxSucursalxDia'].sort(sortResDate))
        .map((entries: HistoricEntry[]) =>
          entries.filter(entry => entry.Sucursal === this.currentBranch.Title)
        ) // return only data of currentBranch
        .map((entries: HistoricEntry[]) => new SuccessHistoric(entries))
        .catch(err => this.HandleError(err, ErrorHistoric))
    })

  @Effect()
  requestKPI$ = this.actions$
    .ofType(ACTIONS.BRANCH_REQ_KPI_R)
    .map(action => action['payload'])
    .switchMap(payload => {
      return this.kpiService
        .getFromProfile(payload)
        .map(res => res['Kpis'])
        .map((kpis: KPI[]) => new SuccessKPI(kpis))
        .catch(err => this.HandleError(err, ErrorKPI))
    })

  @Effect()
  requestOA$ = this.actions$
    .ofType(ACTIONS.BRANCH_REQ_AOPEN_R)
    .map(action => action['payload'])
    .mergeMap(payload => {
      return this.respuestasService
        .getAbiertasFromProfile(payload)
        .map(res => res['RespuestasPreguntas'])
        .map(
          (answer: OpenAnswer[]) =>
            new SuccessOpenAnswer({ answer: answer, question: payload.pregunta })
        )
        .catch(err => this.HandleError(err, ErrorOpenAnswer))
    })

  @Effect()
  requestQA$ = this.actions$
    .ofType(ACTIONS.BRANCH_REQ_FILTERED_R)
    .map(action => action['payload'])
    .switchMap(payload =>
      this.respuestasService
        .getFiltered(
          Object.assign({}, payload, { profile: this.currentBranch.OldProfileId.toString() })
        )
        .map(res => new SuccessFilteredQuestions(res))
    )
    .catch(err => this.HandleError(err, ErrorFilteredQuestions))

  @Effect()
  requestQS$ = this.actions$
    .ofType(ACTIONS.BRANCH_REQ_QUESTIONS_R)
    .map(action => action['payload'])
    .switchMap(payload => {
      // Trying Some Different RXJS operator
      return this.preguntasService
        .getAllByProfile(payload)
        .map(res => res['Respuestas']) // return only the real data
        .map((questions: Question[]) => {
          const close = questions.filter(q => q.tipoPregunta !== 'Abierta')
          const open = questions.filter(q => q.tipoPregunta === 'Abierta')
          return new SuccessQuestions({ close, open })
        })
        .catch(err => this.HandleError(err, ErrorQuestions))
    })

  @Effect()
  requestStaff$ = this.actions$
    .ofType(ACTIONS.BRANCH_REQ_STAFF_RANKING_R)
    .map(action => action['payload'])
    .switchMap(payload => {
      return this.preguntasService
        .getRankingCamareros(payload)
        .map(res => res['RankingCamareros'].sort((prev, curr) => prev.Total > curr.Total))
        .map((ranking: StaffRanking[]) => new SuccessStaffRanking(ranking))
        .catch(err => this.HandleError(err, ErrorStaffRanking))
    })

  @Effect()
  applyQuery$ = this.actions$
    .ofType(ACTIONS.BRANCH_APPLY_CURRENT_QUERY)
    .map(action => action['payload'])
    .map(payload => ({
      profile: this.currentBranch.OldProfileId.toString(),
      ...payload
    }))
    .switchMap(query => {
      return Observable.of(new SaveCurrentQuery(query))
    })

  public currentBranch: UserProfile
  constructor(
    private actions$: Actions,
    private kpiService: KpisService,
    private preguntasService: QuestionsService,
    private respuestasService: RespuestasService,
    private staffService: StaffService,
    private store: Store<AppState>
  ) {
    this.store
      .select('currentBranch')
      .distinctUntilKeyChanged('info')
      .subscribe(({ info }: BranchState) => (this.currentBranch = info))
  }

  private HandleError(error: any, Action: any): Observable<any> {
    if (error.status === 401) {
      return Observable.of({ type: AuthTypes.LOGOUT_START })
    } else {
      return Observable.of(new Action(error))
    }
  }
}
