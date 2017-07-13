import { Action } from '@ngrx/store';
import * as ACTIONS from './branch.types';

import { ActionEnhanced } from '@models/action.enhanced';
import { UserProfile} from '@models/userprofile';
import { RequestError } from '@models/request-error';
import { Pregunta } from '@models/pregunta';
import { CloseAnswer } from '@models/answer.close';
import { OpenAnswer } from '@models/answer.open';
import { KPI } from '@models/kpi';
import { StaffRanking } from '@models/staff-ranking';
import { HistoricEntry } from '@models/historic-entry';
import { APIRequestParams, APIRequestUser, APIRequestRespuesta } from '@models/apiparams';
import QuestionFilter from '@models/filter-question';

const getSectionName = (type: string) => type.split('_')[1];

// Requests
export class RequestQuestions implements ActionEnhanced {
  public type = ACTIONS.BRANCH_REQ_QUESTIONS_R;
  public section = getSectionName(this.type);

  constructor(public payload: APIRequestUser, public message: string) { }
}

export class RequestOpenAnswer implements ActionEnhanced {
  public type = ACTIONS.BRANCH_REQ_AOPEN_R;
  public section = getSectionName(this.type);

  constructor(public payload: APIRequestRespuesta, message: string) { }
}

export class RequestCloseAnswer implements ActionEnhanced {
  public type = ACTIONS.BRANCH_REQ_ACLOSE_R;
  public section = getSectionName(this.type);

  constructor(public payload: APIRequestRespuesta, message: string) { }
}

export class RequestKPI implements ActionEnhanced {
  public type = ACTIONS.BRANCH_REQ_KPI_R;
  public section = getSectionName(this.type);

  constructor(public payload: APIRequestUser, message: string) { }
}

export class RequestStaffRanking implements ActionEnhanced {
  public type = ACTIONS.BRANCH_REQ_STAFF_RANKING_R;
  public section = getSectionName(this.type);

  constructor(public payload: APIRequestUser, message: string) { }
}

export class RequestHistoric implements ActionEnhanced {
  public type = ACTIONS.BRANCH_REQ_HISTORIC_R;
  public section = getSectionName(this.type);

  constructor(public payload: APIRequestParams, message: string) { }
}

// Errors
export class ErrorQuestions implements ActionEnhanced {
  public type = ACTIONS.BRANCH_REQ_QUESTIONS_E;
  public section = getSectionName(this.type);

  constructor(public payload: RequestError) { }
}

export class ErrorOpenAnswer implements Action {
  public type = ACTIONS.BRANCH_REQ_AOPEN_E;
  public section = getSectionName(this.type);

  constructor(public payload: RequestError) { }
}

export class ErrorCloseAnswer implements ActionEnhanced {
  public type = ACTIONS.BRANCH_REQ_ACLOSE_E;
  public section = getSectionName(this.type);

  constructor(public payload: RequestError) { }
}

export class ErrorKPI implements ActionEnhanced {
  public type = ACTIONS.BRANCH_REQ_KPI_E;
  public section = getSectionName(this.type);

  constructor(public payload: RequestError) { }
}

export class ErrorStaffRanking implements ActionEnhanced {
  public type = ACTIONS.BRANCH_REQ_STAFF_RANKING_E;
  public section = getSectionName(this.type);

  constructor(public payload: RequestError) { }
}

export class ErrorHistoric implements ActionEnhanced {
  public type = ACTIONS.BRANCH_REQ_HISTORIC_E;
  public section = getSectionName(this.type);

  constructor(public payload: RequestError) { }
}


// Success
export class SuccessQuestions implements ActionEnhanced {
  public type = ACTIONS.BRANCH_REQ_QUESTIONS_S;
  public section = getSectionName(this.type);

  constructor(public payload: {close: Pregunta[], open: Pregunta[]}) { }
}

export class SuccessOpenAnswer implements ActionEnhanced {
  public type = ACTIONS.BRANCH_REQ_AOPEN_S;
  public section = getSectionName(this.type);

  constructor(public payload: {answer: OpenAnswer[], question: string}) { }
}

export class SuccessCloseAnswer implements ActionEnhanced {
  public type = ACTIONS.BRANCH_REQ_ACLOSE_S;
  public section = getSectionName(this.type);

  constructor(public payload: {answer: CloseAnswer[], question: string}) { }
}

export class SuccessKPI implements ActionEnhanced {
  public type = ACTIONS.BRANCH_REQ_KPI_S;
  public section = getSectionName(this.type);

  constructor(public payload: KPI[]) { }
}

export class SuccessStaffRanking implements ActionEnhanced {
  public type = ACTIONS.BRANCH_REQ_STAFF_RANKING_S;
  public section = getSectionName(this.type);

  constructor(public payload: StaffRanking[]) { }
}

export class SuccessHistoric implements ActionEnhanced {
  public type = ACTIONS.BRANCH_REQ_HISTORIC_S;
  public section = getSectionName(this.type);

  constructor(public payload: HistoricEntry[]) { }
}


// Resets & Saves
export class ResetAll implements Action {
  public type = ACTIONS.BRANCH_RESET_ALL;

  constructor(public payload?: any) { }
}

export class ResetButInfo implements Action {
  public type = ACTIONS.BRANCH_RESET_BUT_INFO;

  constructor(public payload?: any) { }
}

export class SaveInfo implements Action {
  public type = ACTIONS.BRANCH_INFO_SAVE;

  constructor(public payload: UserProfile) { }
}

// Filters and Queries
export class ApplyCurrentQuery implements Action {
  public type = ACTIONS.BRANCH_APPLY_CURRENT_QUERY;

  constructor(public payload: QuestionFilter) { }
}

export class SaveCurrentQuery implements Action {
  public type = ACTIONS.BRANCH_SAVE_CURRENT_QUERY;

  constructor(public payload: APIRequestUser) { }
}
