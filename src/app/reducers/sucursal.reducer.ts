import { Action } from '@ngrx/store';

import * as moment from 'moment';

import { SucursalState } from '../models/sucursalstate';

import { ActionTypes } from '../actions/sucursal.actions';

import { updateObject } from '../utilities/objects';

const { LOAD_QUESTIONS, SAVE_LOADED_QUESTIONS, LOAD_ANSWERS,
  SAVE_LOADED_ANSWERS, START_REQUEST, FILTER_DATE, FILTER_ANSWER,
  SAVE_INFO, SAVE_LAST, APPLY_FILTER, END_REQUEST, RESET_SUCURSAL,
  RESET_QA, RESET_ANSWERS, RESET_QUESTIONS } = ActionTypes;


export const INITIAL_STATE = {
  info: {},
  questions: [],
  openQuestions: [],
  answers: [],
  filters: {},
  dates: {},
  lastQuery: {},
  lastResult: {},
  currentAction: {},
  loading: false
}

export function SucursalesCases() {
  return {
    [LOAD_QUESTIONS]: requesting,
    [SAVE_LOADED_QUESTIONS]: saveLoadedQuestions,
    [LOAD_ANSWERS]: requesting,
    [SAVE_LOADED_ANSWERS]: saveLoadedAnswers,
    [START_REQUEST]: requesting,
    [END_REQUEST]: stopRequesting,
    [FILTER_DATE]: filterByDate,
    [FILTER_ANSWER]: filterByAnswer,
    [SAVE_INFO]: saveSucursal,
    [SAVE_LAST]: saveLastRequest,
    [APPLY_FILTER]: applyFilter,
    [RESET_SUCURSAL]: () => INITIAL_STATE,
    [RESET_QA]: restoreQA,
    [RESET_ANSWERS]: restoreAnswers,
    [RESET_QUESTIONS]: restoreQuestions,
  }
}

function requesting(state: SucursalState, action: Action): SucursalState {
  const { payload } = action;
  return updateObject(state, {loading: true, currentAction: payload});
}

function stopRequesting(state: SucursalState, action: Action): SucursalState {
  const { payload } = action;
  return updateObject(state, {loading: false, currentAction: ''});
}

function saveLoadedQuestions(state: SucursalState, action: Action): SucursalState {
  const { payload } = action;
  return updateObject(state, {questions: payload});
}

function saveLoadedAnswers(state: SucursalState, action: Action): SucursalState {
  const { payload } = action;
  return updateObject(state, {answers: payload});
}

function filterByDate(state: SucursalState, action: Action): SucursalState {
  const { payload } = action;
  const { start, end } = payload;

  let startM = moment(start);
  let endM = moment(end);

  let answersInRange = state.answers.filter(answer =>
   startM.isSameOrAfter(answer.fecha) || endM.isSameOrBefore(answer.fecha)
   );

  return updateObject(state, {answers: answersInRange});
}

function filterByAnswer(state: SucursalState, action: Action): SucursalState {
  const { payload } = action;
  return updateObject(state, {answers: state.answers.filter(answer =>
    answer.id === payload
  )});
}

function saveSucursal(state: SucursalState, action: Action): SucursalState {
  const { payload } = action;

  return updateObject(state, {info: payload});
}

function saveLastRequest(state: SucursalState, action: Action): SucursalState {
  const { payload } = action;

  return updateObject(state, {lastQuery: payload.query, lastResult: payload.result});
}

function applyFilter(state: SucursalState, action: Action): SucursalState {
  const { payload } = action;

  return updateObject(state, {filters: [...state.filters, payload]});
}

function restoreQA(state: SucursalState, action: Action): SucursalState {
  return updateObject(state, {questions: [], openQuestions: [], answers: []})
}

function restoreQuestions(state: SucursalState, action: Action): SucursalState {
  return updateObject(state, {questions: [], openQuestions: []});
}

function restoreAnswers(state: SucursalState, action: Action): SucursalState {
  return updateObject(state, {answers: []});
}
