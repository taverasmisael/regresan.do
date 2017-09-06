import { Action } from '@ngrx/store'
import * as ACTIONS from './branch.types'

import { EnhancedAction } from '@models/enhancedAction'
import { UserProfile } from '@models/userprofile'
import { RequestError } from '@models/requestError'
import { Question } from '@models/question'
import { CloseAnswer } from '@models/closeAnswer'
import { OpenAnswer } from '@models/openAnswer'
import { KPI } from '@models/kpi'
import { StaffRanking } from '@models/staffRanking'
import { HistoricEntry } from '@models/historicEntry'
import { StandardRequest } from '@models/standardRequest'
import { OpenAnswerRequest } from '@models/openAnswerRequest'
import { AnswerRequest } from '@models/answerRequest'
import { QuestionFilter } from '@models/questionFilter'

const getSectionName = (type: string) => type.split('_')[1]

// Requests
export class RequestQuestions implements EnhancedAction {
  public type = ACTIONS.BRANCH_REQ_QUESTIONS_R
  public section = getSectionName(this.type)

  constructor(public payload: StandardRequest, public message: string) {}
}

export class RequestFilteredQuestions implements EnhancedAction {
  public type = ACTIONS.BRANCH_REQ_FILTERED_R
  public section = getSectionName(this.type)

  constructor(public payload: AnswerRequest, public message: string) {}
}

export class RequestOpenAnswer implements EnhancedAction {
  public type = ACTIONS.BRANCH_REQ_AOPEN_R
  public section = getSectionName(this.type)

  constructor(public payload: OpenAnswerRequest, message: string) {}
}

export class RequestCloseAnswer implements EnhancedAction {
  public type = ACTIONS.BRANCH_REQ_ACLOSE_R
  public section = getSectionName(this.type)

  constructor(public payload: OpenAnswerRequest, message: string) {}
}

export class RequestKPI implements EnhancedAction {
  public type = ACTIONS.BRANCH_REQ_KPI_R
  public section = getSectionName(this.type)

  constructor(public payload: StandardRequest, message: string) {}
}

export class RequestStaffRanking implements EnhancedAction {
  public type = ACTIONS.BRANCH_REQ_STAFF_RANKING_R
  public section = getSectionName(this.type)

  constructor(public payload: StandardRequest, message: string) {}
}

export class RequestHistoric implements EnhancedAction {
  public type = ACTIONS.BRANCH_REQ_HISTORIC_R
  public section = getSectionName(this.type)

  constructor(public payload: StandardRequest, message: string) {}
}

// Errors
export class ErrorQuestions implements EnhancedAction {
  public type = ACTIONS.BRANCH_REQ_QUESTIONS_E
  public section = getSectionName(this.type)

  constructor(public payload: RequestError) {}
}

export class ErrorFilteredQuestions implements EnhancedAction {
  public type = ACTIONS.BRANCH_REQ_FILTERED_E
  public section = getSectionName(this.type)
  constructor(public payload: RequestError) {}
}

export class ErrorOpenAnswer implements Action {
  public type = ACTIONS.BRANCH_REQ_AOPEN_E
  public section = getSectionName(this.type)

  constructor(public payload: RequestError) {}
}

export class ErrorCloseAnswer implements EnhancedAction {
  public type = ACTIONS.BRANCH_REQ_ACLOSE_E
  public section = getSectionName(this.type)

  constructor(public payload: RequestError) {}
}

export class ErrorKPI implements EnhancedAction {
  public type = ACTIONS.BRANCH_REQ_KPI_E
  public section = getSectionName(this.type)

  constructor(public payload: RequestError) {}
}

export class ErrorStaffRanking implements EnhancedAction {
  public type = ACTIONS.BRANCH_REQ_STAFF_RANKING_E
  public section = getSectionName(this.type)

  constructor(public payload: RequestError) {}
}

export class ErrorHistoric implements EnhancedAction {
  public type = ACTIONS.BRANCH_REQ_HISTORIC_E
  public section = getSectionName(this.type)

  constructor(public payload: RequestError) {}
}

// Success
export class SuccessQuestions implements EnhancedAction {
  public type = ACTIONS.BRANCH_REQ_QUESTIONS_S
  public section = getSectionName(this.type)

  constructor(public payload: { close: Question[]; open: Question[] }) {}
}

export class SuccessFilteredQuestions implements EnhancedAction {
  public type = ACTIONS.BRANCH_REQ_FILTERED_S
  public section = getSectionName(this.type)
  constructor(public payload: any) {}
}

export class SuccessOpenAnswer implements EnhancedAction {
  public type = ACTIONS.BRANCH_REQ_AOPEN_S
  public section = getSectionName(this.type)

  constructor(public payload: { answer: OpenAnswer[]; question: string }) {}
}

export class SuccessCloseAnswer implements EnhancedAction {
  public type = ACTIONS.BRANCH_REQ_ACLOSE_S
  public section = getSectionName(this.type)

  constructor(public payload: { answer: CloseAnswer[]; question: string }) {}
}

export class SuccessKPI implements EnhancedAction {
  public type = ACTIONS.BRANCH_REQ_KPI_S
  public section = getSectionName(this.type)

  constructor(public payload: KPI[]) {}
}

export class SuccessStaffRanking implements EnhancedAction {
  public type = ACTIONS.BRANCH_REQ_STAFF_RANKING_S
  public section = getSectionName(this.type)

  constructor(public payload: StaffRanking[]) {}
}

export class SuccessHistoric implements EnhancedAction {
  public type = ACTIONS.BRANCH_REQ_HISTORIC_S
  public section = getSectionName(this.type)

  constructor(public payload: HistoricEntry[]) {}
}

// Resets & Saves
export class ResetAll implements Action {
  public type = ACTIONS.BRANCH_RESET_ALL

  constructor(public payload?: any) {}
}

export class ResetButInfo implements Action {
  public type = ACTIONS.BRANCH_RESET_BUT_INFO

  constructor(public payload?: any) {}
}

export class SaveInfo implements Action {
  public type = ACTIONS.BRANCH_INFO_SAVE

  constructor(public payload: UserProfile) {}
}

// Filters and Queries
export class ApplyCurrentQuery implements Action {
  public type = ACTIONS.BRANCH_APPLY_CURRENT_QUERY

  constructor(public payload: QuestionFilter | StandardRequest) {}
}

export class SaveCurrentQuery implements Action {
  public type = ACTIONS.BRANCH_SAVE_CURRENT_QUERY

  constructor(public payload: StandardRequest) {}
}
