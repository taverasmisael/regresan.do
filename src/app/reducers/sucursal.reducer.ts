import { Action } from '@ngrx/store';

import * as moment from 'moment';

import { SucursalState } from '../models/states/sucursalstate';

import { ActionTypes } from '../actions/sucursal.actions';

import { updateObject, updateItemInArray } from '../utilities/objects';

const { LOAD_QUESTIONS, SAVE_CLOSE_QUESTIONS, LOAD_ANSWERS,
  SAVE_CLOSE_ANSWER, SAVE_OPEN_ANSWERS, SAVE_OPEN_QUESTIONS, SAVE_CLOSE_ANSWER_CHART,
  START_REQUEST, FILTER_DATE, FILTER_ANSWER, SAVE_INFO, SAVE_LAST, UPDATE_CLOSE_ANSWER_CHART,
  APPLY_FILTER, END_REQUEST, RESET_SUCURSAL, RESET_QA, RESET_ANSWERS,
  RESET_QUESTIONS, SAVE_HISTORIC, SAVE_STAFF_RANKING, SAVE_KPIS, RESET_KPIS} = ActionTypes;


export const INITIAL_STATE = new SucursalState();

export function SucursalesCases() {
  return {
    [LOAD_QUESTIONS]: requesting,
    [SAVE_CLOSE_QUESTIONS]: saveCloseQuestions,
    [SAVE_OPEN_QUESTIONS]: saveOpenQuestions,
    [LOAD_ANSWERS]: requesting,
    [SAVE_CLOSE_ANSWER]: saveCloseAnswer,
    [SAVE_CLOSE_ANSWER_CHART]: saveAnswerChart,
    [UPDATE_CLOSE_ANSWER_CHART]: updateAnswerChart,
    [SAVE_OPEN_ANSWERS]: saveOpenAnswers,
    [START_REQUEST]: requesting,
    [END_REQUEST]: stopRequesting,
    [FILTER_DATE]: filterByDate,
    [FILTER_ANSWER]: filterByAnswer,
    [SAVE_INFO]: saveSucursal,
    [SAVE_STAFF_RANKING]: saveStaffRanking,
    [SAVE_HISTORIC]: saveHistoric,
    [SAVE_LAST]: saveLastRequest,
    [APPLY_FILTER]: applyFilter,
    [RESET_SUCURSAL]: () => INITIAL_STATE,
    [RESET_QA]: restoreQA,
    [RESET_ANSWERS]: restoreAnswers,
    [RESET_QUESTIONS]: restoreQuestions,
    [SAVE_KPIS]: saveKPIS,
    [RESET_KPIS]: restoreKPIS,
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

function saveCloseQuestions(state: SucursalState, action: Action): SucursalState {
  const { payload } = action;
  return updateObject(state, {closeQuestions: payload});
}

function saveOpenQuestions(state: SucursalState, action: Action): SucursalState {
  const { payload } = action;
  return updateObject(state, {openQuestions: payload});
}

function saveCloseAnswer(state: SucursalState, action: Action): SucursalState {
  const { payload } = action;
  return updateObject(state, {closeAnswers: [...state.closeAnswers, payload]});
}

function saveAnswerChart(state: SucursalState, action: Action): SucursalState {
  const { payload } = action;
  return updateObject(state, {answerCharts: updateObject(state.answerCharts,  payload)});
}

function updateAnswerChart(state: SucursalState, action: Action): SucursalState {
  const { payload } = action;
  const { id, newChart } = payload;
  return updateObject(state, {answerCharts: updateObject(state.answerCharts, {[id]: newChart})});
}

function saveOpenAnswers(state: SucursalState, action: Action): SucursalState {
  const { payload } = action;
  return updateObject(state, {openAnswers: payload});
}

function filterByDate(state: SucursalState, action: Action): SucursalState {
  const { payload } = action;
  const { start, end } = payload;

  let startM = moment(start);
  let endM = moment(end);

  let answersInRange = state.closeAnswers.filter(answer =>
   startM.isSameOrAfter(answer.fecha) || endM.isSameOrBefore(answer.fecha)
   );

  return updateObject(state, {closeAnswers: answersInRange});
}

function filterByAnswer(state: SucursalState, action: Action): SucursalState {
  const { payload } = action;
  return updateObject(state, {answers: state.closeAnswers.filter(answer =>
    answer.id === payload
  )});
}

function saveSucursal(state: SucursalState, action: Action): SucursalState {
  const { payload } = action;

  return updateObject(state, {info: payload});
}

function saveStaffRanking(state: SucursalState, action: Action): SucursalState {
  const { payload } = action;

  return updateObject(state, {staffRanking: payload});
}

function saveKPIS(state: SucursalState, action: Action): SucursalState {
  const { payload } = action;

  return updateObject(state, {kpis: payload});
}

function restoreKPIS(state: SucursalState, action: Action): SucursalState {
  const { payload } = action;

  return updateObject(state, {kpis: []});
}
function saveHistoric(state: SucursalState, action: Action): SucursalState {
  const { payload } = action;

  return updateObject(state, {historicoEncuestas: updateObject(state.historicoEncuestas, payload)});
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
  return updateObject(state, {closeQuestions: [], openQuestions: [], closeAnswers: [], openAnswers: [], answerCharts: {}})
}

function restoreQuestions(state: SucursalState, action: Action): SucursalState {
  return updateObject(state, {closeQuestions: [], openQuestions: []});
}

function restoreAnswers(state: SucursalState, action: Action): SucursalState {
  return updateObject(state, {closeAnswers: [], openAnswers: []});
}
