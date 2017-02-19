import { Action } from '@ngrx/store';
import * as ACTIONS from './branch.types';
import { UserProfile} from '@models/userprofile';
import { RequestError } from '@models/request-error';
import { Pregunta } from '@models/pregunta';
import { OpenAnswer } from '@models/answer.open';
import { KPI } from '@models/kpi';
import { StaffRanking } from '@models/staff-ranking';
import { HistoricEntry } from '@models/historic-entry';

// Requests
export class RequestOpenQuestion implements Action {
  public type = ACTIONS.BRANCH_REQ_QOPEN_R;

  constructor(public payload: string) { }
}

export class RequestCloseQuestion implements Action {
  public type = ACTIONS.BRANCH_REQ_QCLOSE_R;

  constructor(public payload: string) { }
}

export class RequestOpenAnswer implements Action {
  public type = ACTIONS.BRANCH_REQ_AOPEN_R;

  constructor(public payload: string) { }
}

export class RequestCloseAnswer implements Action {
  public type = ACTIONS.BRANCH_REQ_ACLOSE_R;

  constructor(public payload: string) { }
}

export class RequestKPI implements Action {
  public type = ACTIONS.BRANCH_REQ_KPI_R;

  constructor(public payload: string) { }
}

export class RequestStaffRanking implements Action {
  public type = ACTIONS.BRANCH_REQ_STAFF_RANKING_R;

  constructor(public payload: string) { }
}

export class RequestHistoric implements Action {
  public type = ACTIONS.BRANCH_REQ_HISTORIC_R;

  constructor(public payload: string) { }
}

// Errors
export class ErrorOpenQuestion implements Action {
  public type = ACTIONS.BRANCH_REQ_QOPEN_E;

  constructor(public payload: RequestError) { }
}

export class ErrorCloseQuestion implements Action {
  public type = ACTIONS.BRANCH_REQ_QCLOSE_E;

  constructor(public payload: RequestError) { }
}

export class ErrorOpenAnswer implements Action {
  public type = ACTIONS.BRANCH_REQ_AOPEN_E;

  constructor(public payload: RequestError) { }
}

export class ErrorCloseAnswer implements Action {
  public type = ACTIONS.BRANCH_REQ_ACLOSE_E;

  constructor(public payload: RequestError) { }
}

export class ErrorKPI implements Action {
  public type = ACTIONS.BRANCH_REQ_KPI_E;

  constructor(public payload: RequestError) { }
}

export class ErrorStaffRanking implements Action {
  public type = ACTIONS.BRANCH_REQ_STAFF_RANKING_E;

  constructor(public payload: RequestError) { }
}

export class ErrorHistoric implements Action {
  public type = ACTIONS.BRANCH_REQ_HISTORIC_E;

  constructor(public payload: RequestError) { }
}


// Success
export class SuccessOpenQuestion implements Action {
  public type = ACTIONS.BRANCH_REQ_QOPEN_S;

  constructor(public payload: Pregunta[]) { }
}

export class SuccessCloseQuestion implements Action {
  public type = ACTIONS.BRANCH_REQ_QCLOSE_S;

  constructor(public payload: Pregunta[]) { }
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
