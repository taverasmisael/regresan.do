import { ActionEnhanced } from '@models/action.enhanced';

import * as moment from 'moment';

import { BranchState } from '@models/states/branch';
import { StateRequest } from '@models/states/state-request';

import { updateObject, updateItemInArray } from '@utilities/objects';

import {
  BRANCH_REQ_QUESTIONS_R, BRANCH_REQ_QUESTIONS_S, BRANCH_REQ_QUESTIONS_E,
  BRANCH_REQ_AOPEN_R, BRANCH_REQ_AOPEN_S, BRANCH_REQ_AOPEN_E,
  BRANCH_REQ_ACLOSE_R, BRANCH_REQ_ACLOSE_S, BRANCH_REQ_ACLOSE_E,
  BRANCH_REQ_KPI_R, BRANCH_REQ_KPI_S, BRANCH_REQ_KPI_E,
  BRANCH_REQ_STAFF_RANKING_R, BRANCH_REQ_STAFF_RANKING_S, BRANCH_REQ_STAFF_RANKING_E,
  BRANCH_REQ_HISTORIC_R, BRANCH_REQ_HISTORIC_S, BRANCH_REQ_HISTORIC_E,
  BRANCH_RESET_ALL, BRANCH_RESET_BUT_INFO, BRANCH_INFO_SAVE, BRANCH_SAVE_CURRENT_QUERY
} from '@actions/branch.types';

export const INITIAL_STATE = new BranchState();

export function BranchCases() {
  return {
    // Resets and Saves
    [BRANCH_INFO_SAVE]: saveInfo,
    [BRANCH_RESET_ALL]: resetStore,
    [BRANCH_RESET_BUT_INFO]: resetDate,
    [BRANCH_REQ_QUESTIONS_R]: requesting,
    [BRANCH_REQ_AOPEN_R]: requestingAnswer,
    [BRANCH_REQ_ACLOSE_R]: requestingAnswer,
    [BRANCH_REQ_KPI_R]: requesting,
    [BRANCH_REQ_STAFF_RANKING_R]: requesting,
    [BRANCH_REQ_HISTORIC_R]: requesting,
    [BRANCH_REQ_QUESTIONS_E]: requestError,
    [BRANCH_REQ_AOPEN_E]: requestAnswerError,
    [BRANCH_REQ_ACLOSE_E]: requestAnswerError,
    [BRANCH_REQ_KPI_E]: requestError,
    [BRANCH_REQ_STAFF_RANKING_E]: requestError,
    [BRANCH_REQ_HISTORIC_E]: requestError,
    [BRANCH_REQ_QUESTIONS_S]: saveQuestions,
    [BRANCH_REQ_AOPEN_S]: saveAOpen,
    [BRANCH_REQ_ACLOSE_S]: saveAClose,
    [BRANCH_REQ_KPI_S]: saveKPI,
    [BRANCH_REQ_STAFF_RANKING_S]: saveStaffRanking,
    [BRANCH_REQ_HISTORIC_S]: saveHistoric,
    [BRANCH_SAVE_CURRENT_QUERY]: saveCurrentQuery
  }
}

function saveInfo(state: BranchState, action: ActionEnhanced): BranchState {
  const { payload } = action;

  return updateObject(state, { info: payload });
}

function resetStore(state: BranchState, action: ActionEnhanced): BranchState {
  const { payload } = action;

  return updateObject(state, INITIAL_STATE);
}

function resetDate(state: BranchState, action: ActionEnhanced): BranchState {
  const { payload } = action;

  return Object.assign(state, INITIAL_STATE, { info: state.info });
}

function requesting(state: BranchState, action: ActionEnhanced): BranchState {
  const { payload, message, section } = action;

  return updateObject(state, {
    requests: updateObject(state.requests, { [section]: new StateRequest(undefined, true, message) })
  });
}

function requestingAnswer(state: BranchState, action: ActionEnhanced): BranchState {
  const { payload, message, section } = action;

  return updateObject(state, {
    requests: updateObject(state.requests, { [section]: [
      ...state.requests[section],
      new StateRequest(undefined, true, message, payload.pregunta)
    ] })
  });
}

function requestAnswerError(state: BranchState, action: ActionEnhanced): BranchState {
  const { payload, message, section } = action;

  return updateObject(state, {
    requests: updateObject(state.requests, { [section]: [
      ...state.requests[section],
      new StateRequest(payload, false, '', payload.pregunta)
    ] })
  });
}

function requestError(state: BranchState, action: ActionEnhanced): BranchState {
  const { payload, section } = action;

  return updateObject(state, {
    requests: updateObject(state.requests, { [section]: new StateRequest(payload, false, '') })
  });
}

function saveQuestions(state: BranchState, action: ActionEnhanced): BranchState {
  const { payload, section } = action;

  return updateObject(state, {
    openQuestions: payload.open,
    closeQuestions: payload.close,
    requests: updateObject(state.requests, {
      [section]: new StateRequest(undefined, false, '')
    })
  });
}

function saveQClose(state: BranchState, action: ActionEnhanced): BranchState {
  const { payload, section } = action;

  return updateObject(state, {
    closeQuestions: payload,
    requests: updateObject(state.requests, {
      [section]: new StateRequest(undefined, false, '')
    })
  });
}

function saveAOpen(state: BranchState, action: ActionEnhanced): BranchState {
  const { payload, section } = action;
  const { answer, question } = payload;

  return updateObject(state, {
    openAnswers: [...state.openAnswers, answer],
    requests: updateObject(state.requests, {
      [section]: state.requests[section].map((sr: StateRequest) => {
        if (sr.id === question) {
          return updateObject(sr, {isLoading: false, error: undefined, text: '' })
        } else {
          return sr;
        }
      })
    })
  });
}

function saveAClose(state: BranchState, action: ActionEnhanced): BranchState {
  const { payload, section } = action;
  const { answer, question } = payload;

  return updateObject(state, {
    closeAnswers: [...state.closeAnswers, answer],
    requests: updateObject(state.requests, {
      [section]: state.requests[section].map((sr: StateRequest) => {
        if (sr.id === question) {
          return updateObject(sr, {isLoading: false, error: undefined, text: '' })
        } else {
          return sr;
        }
      })
    })
  });
}

function saveKPI(state: BranchState, action: ActionEnhanced): BranchState {
  const { payload, section } = action;

  return updateObject(state, {
    kpis: payload,
    requests: updateObject(state.requests, {
      [section]: new StateRequest(undefined, false, '')
    })
  });
}

function saveStaffRanking(state: BranchState, action: ActionEnhanced): BranchState {
  const { payload } = action;

  return updateObject(state, { staffRanking: payload });
}
function saveHistoric(state: BranchState, action: ActionEnhanced): BranchState {
  const { payload, section } = action;

  return updateObject(state, {
    historicData: payload,
    requests: updateObject(state.requests, {
      [section]: new StateRequest(undefined, false, '')
    })
  });
}

function saveCurrentQuery(state: BranchState, action: ActionEnhanced): BranchState {
  const { payload } = action;
  return updateObject(state, {
    currentQuery: payload
  });
}