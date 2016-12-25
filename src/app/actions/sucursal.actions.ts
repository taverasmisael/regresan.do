import { Action } from '@ngrx/store';

export const ActionTypes = {
  LOAD_QUESTIONS: '[SUCURSALES] LOAD_QUESTIONS',
  SAVE_LOADED_QUESTIONS: '[SUCURSALES] SAVE_LOADED_QUESTIONS',
  LOAD_ANSWERS: '[SUCURSALES] LOAD_ANSWERS',
  SAVE_LOADED_ANSWERS: '[SUCURSALES] SAVE_LOADED_ANSWERS',
  START_REQUEST: '[SUCURSALES] START_REQUEST',
  FILTER_DATE: '[SUCURSALES] FILTER_DATE',
  FILTER_ANSWER: '[SUCURSALES] FILTER_ANSWER',
  SAVE_INFO: '[SUCURSALES] SAVE_INFO',
  SAVE_LAST: '[SUCURSALES] SAVE_LAST',
  APPLY_FILTER: '[SUCURSALES] APPLY_FILTER'
};

export class LoadQuestions implements Action {
  type = ActionTypes.LOAD_QUESTIONS;

  constructor(public payload) { }
}

export class SaveLoadedQuestions implements Action {
  type = ActionTypes.SAVE_LOADED_QUESTIONS;

  constructor(public payload) { }
}

export class LoadAnswers implements Action {
  type = ActionTypes.LOAD_ANSWERS;

  constructor(public payload) { }
}
export class SaveLoadAnswers implements Action {
  type = ActionTypes.SAVE_LOADED_ANSWERS;

  constructor(public payload) { }
}

export class StartRequest implements Action {
  type = ActionTypes.START_REQUEST;

  constructor(public payload) { }
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

