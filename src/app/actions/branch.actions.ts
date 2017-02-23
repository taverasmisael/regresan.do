import { Action } from '@ngrx/store';
import * as ACTIONS from './branch.types';

import { ActionEnhanced } from '@models/action.enhanced';
import { UserProfile} from '@models/userprofile';
import { RequestError } from '@models/request-error';
import { Pregunta } from '@models/pregunta';
import { OpenAnswer } from '@models/answer.open';
import { KPI } from '@models/kpi';
import { StaffRanking } from '@models/staff-ranking';
import { HistoricEntry } from '@models/historic-entry';
import { APIRequestParams, APIRequestUser, APIRequestRespuesta } from '@models/apiparams';

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
export class SuccessQuestions implements Action {
  public type = ACTIONS.BRANCH_REQ_QUESTIONS_S;

  constructor(public payload: {close: Pregunta[], open: Pregunta[]}) { }
}

export class SuccessOpenAnswer implements Action {
  public type = ACTIONS.BRANCH_REQ_AOPEN_S;

  constructor(public payload: OpenAnswer[]) { }
}

export class SuccessCloseAnswer implements Action {
  public type = ACTIONS.BRANCH_REQ_ACLOSE_S;

  constructor(public payload: Pregunta[]) { }
}

export class SuccessKPI implements Action {
  public type = ACTIONS.BRANCH_REQ_KPI_S;

  constructor(public payload: KPI[]) { }
}

export class SuccessStaffRanking implements Action {
  public type = ACTIONS.BRANCH_REQ_STAFF_RANKING_S;

  constructor(public payload: StaffRanking[]) { }
}

export class SuccessHistoric implements Action {
  public type = ACTIONS.BRANCH_REQ_HISTORIC_S;

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
