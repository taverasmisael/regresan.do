import { Action } from '@ngrx/store';

export const ActionTypes = {
  LOAD_QUESTIONS: '[SUCURSALES] LOAD_QUESTIONS',
  SAVE_CLOSE_QUESTIONS: '[SUCURSALES] SAVE_CLOSE_QUESTIONS',
  SAVE_OPEN_QUESTIONS: '[SUCURSALES] SAVE_OPEN_QUESTIONS',
  LOAD_ANSWERS: '[SUCURSALES] LOAD_ANSWERS',
  SAVE_CLOSE_ANSWERS: '[SUCURSALES] SAVE_CLOSE_ANSWERS',
  SAVE_OPEN_ANSWERS: '[SUCURSALES] SAVE_OPEN_ANSWERS',
  START_REQUEST: '[SUCURSALES] START_REQUEST',
  END_REQUEST: '[SUCURSALES] END_REQUEST',
  FILTER_DATE: '[SUCURSALES] FILTER_DATE',
  FILTER_ANSWER: '[SUCURSALES] FILTER_ANSWER',
  SAVE_INFO: '[SUCURSALES] SAVE_INFO',
  SAVE_LAST: '[SUCURSALES] SAVE_LAST',
  APPLY_FILTER: '[SUCURSALES] APPLY_FILTER',
  RESET_SUCURSAL: '[SUCURSALES]: RESET_SUCURSAL',
  RESET_QUESTIONS: '[SUCURSALES]: RESET_QUESTIONS',
  RESET_ANSWERS: '[SUCURSALES]: RESET_ANSWERS',
  RESET_QA: '[SUCURSALES]: RESET_QA'
};

export class LoadQuestions implements Action {
  type = ActionTypes.LOAD_QUESTIONS;

  constructor(public payload) { }
}

export class SaveCloseQuestions implements Action {
  type = ActionTypes.SAVE_CLOSE_QUESTIONS;

  constructor(public payload) { }
}

export class SaveOpenQuestions implements Action {
  type = ActionTypes.SAVE_OPEN_QUESTIONS;

  constructor(public payload) { }
}

export class LoadAnswers implements Action {
  type = ActionTypes.LOAD_ANSWERS;

  constructor(public payload) { }
}

export class SaveCloseAnswers implements Action {
  type = ActionTypes.SAVE_CLOSE_ANSWERS;

  constructor(public payload) { }
}

export class SaveOpenAnswers implements Action {
  type = ActionTypes.SAVE_OPEN_ANSWERS;

  constructor(public payload) { }
}

export class StartRequest implements Action {
  type = ActionTypes.START_REQUEST;

  constructor(public payload) { }
}

export class StopRequest implements Action {
  type = ActionTypes.END_REQUEST;

  constructor(public payload?) { }
}

export class FilterDate implements Action {
  type = ActionTypes.FILTER_DATE;

  constructor(public payload) { }
}

export class FilterAnswer implements Action {
  type = ActionTypes.FILTER_ANSWER;

  constructor(public payload) { }
}

export class SaveInfo implements Action {
  type = ActionTypes.SAVE_INFO;

  constructor(public payload) { }
}

export class SaveLast implements Action {
  type = ActionTypes.SAVE_LAST;

  constructor(public payload) { }
}

export class ApplyFilter implements Action {
  type = ActionTypes.APPLY_FILTER;

  constructor(public payload) { }
}

export class ResetSucursal implements Action {
  type = ActionTypes.RESET_SUCURSAL;

  constructor(public payload?) { }
}

export class ResetQuestions implements Action {
  type = ActionTypes.RESET_QUESTIONS;

  constructor(public payload?) { }
}

export class ResetAnswers implements Action {
  type = ActionTypes.RESET_ANSWERS;

  constructor(public payload?) { }
}

export class ResetQA implements Action {
  type = ActionTypes.RESET_QA;

  constructor(public payload?) { }
}
