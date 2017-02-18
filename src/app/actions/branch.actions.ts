import { Action } from '@ngrx/store';
import * as ACTIONS from './branch.types';

import { RequestError } from '../models/request-error';
import { Pregunta } from '../models/pregunta';
import { OpenAnswer } from '../models/answer.open';

// Requests
export class RequestOpenQuestion implements Action {
  public type = ACTIONS.BRANCH_REQ_QOPEN_R;

  constructor(public payload: Requesting) { }
}

export class RequestCloseQuestion implements Action {
  public type = ACTIONS.BRANCH_REQ_QCLOSE_R;

  constructor(public payload: Requesting) { }
}

export class RequestOpenAnswer implements Action {
  public type = ACTIONS.BRANCH_REQ_AOPEN_R;

  constructor(public payload: Requesting) { }
}

export class RequestCloseAnswer implements Action {
  public type = ACTIONS.BRANCH_REQ_ACLOSE_R;

  constructor(public payload: Requesting) { }
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

export interface Requesting {
  text: string
};
