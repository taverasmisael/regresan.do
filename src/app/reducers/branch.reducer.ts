import { Action } from '@ngrx/store';

import * as moment from 'moment';

import { BranchState } from '@models/states/branch';
import { StateRequest } from '@models/states/state-request';

import { updateObject, updateItemInArray } from '@utilities/objects';

import {
  BRANCH_REQ_QOPEN_R, BRANCH_REQ_QOPEN_S, BRANCH_REQ_QOPEN_E,
  BRANCH_REQ_QCLOSE_R, BRANCH_REQ_QCLOSE_S, BRANCH_REQ_QCLOSE_E,
  BRANCH_REQ_AOPEN_R, BRANCH_REQ_AOPEN_S, BRANCH_REQ_AOPEN_E,
  BRANCH_REQ_ACLOSE_R, BRANCH_REQ_ACLOSE_S, BRANCH_REQ_ACLOSE_E,
  BRANCH_REQ_KPI_R, BRANCH_REQ_KPI_S, BRANCH_REQ_KPI_E,
  BRANCH_REQ_STAFF_RANKING_R, BRANCH_REQ_STAFF_RANKING_S, BRANCH_REQ_STAFF_RANKING_E,
  BRANCH_REQ_HISTORIC_R, BRANCH_REQ_HISTORIC_S, BRANCH_REQ_HISTORIC_E,
  BRANCH_RESET_ALL, BRANCH_RESET_BUT_INFO, BRANCH_INFO_SAVE
} from '@actions/branch.types';

const getSectionName = (type: string) => type.split('_')[1];

export const INITIAL_STATE = new BranchState();

export function BranchCases() {
  return {
    // Resets and Saves
    [BRANCH_INFO_SAVE]: saveInfo,
    [BRANCH_RESET_ALL]: resetStore,
    [BRANCH_RESET_BUT_INFO]: resetDate,
    [BRANCH_REQ_QOPEN_R]: requesting,
    [BRANCH_REQ_QCLOSE_R]: requesting,
    [BRANCH_REQ_AOPEN_R]: requesting,
    [BRANCH_REQ_ACLOSE_R]: requesting,
    [BRANCH_REQ_KPI_R]: requesting,
    [BRANCH_REQ_STAFF_RANKING_R]: requesting,
    [BRANCH_REQ_HISTORIC_R]: requesting,
    [BRANCH_REQ_QOPEN_E]: requestError,
    [BRANCH_REQ_QCLOSE_E]: requestError,
    [BRANCH_REQ_AOPEN_E]: requestError,
    [BRANCH_REQ_ACLOSE_E]: requestError,
    [BRANCH_REQ_KPI_E]: requestError,
    [BRANCH_REQ_STAFF_RANKING_E]: requestError,
    [BRANCH_REQ_HISTORIC_E]: requestError,
    [BRANCH_REQ_QOPEN_S]: saveQOpen,
    [BRANCH_REQ_QCLOSE_S]: saveQClose,
    [BRANCH_REQ_AOPEN_S]: saveAOpen,
    [BRANCH_REQ_ACLOSE_S]: saveAClose,
    [BRANCH_REQ_KPI_S]: saveKPI,
    [BRANCH_REQ_STAFF_RANKING_S]: saveStaffRanking,
    [BRANCH_REQ_HISTORIC_S]: saveHistoric
  }
}

function saveInfo(state: BranchState, action: Action): BranchState {
  const { payload } = action;

  return updateObject(state, { info: payload });
}

function resetStore(state: BranchState, action: Action): BranchState {
  const { payload } = action;

  return updateObject(state, INITIAL_STATE);
}

function resetDate(state: BranchState, action: Action): BranchState {
  const { payload } = action;

  return Object.assign(state, INITIAL_STATE, { info: state.info });
}

function requesting(state: BranchState, action: Action): BranchState {
  const { payload } = action;

  const req = getSectionName(action.type); // Get the part your are requesting

  return updateObject(state, {
    requests: updateObject(state.requests, { [req]: new StateRequest(undefined, true, payload) })
  });
}

function requestError(state: BranchState, action: Action): BranchState {
  const { payload } = action;

  // Get the part your are requesting

  const req = getSectionName(action.type);

  return updateObject(state, {
    requests: updateObject(state.requests, { [req]: new StateRequest(payload, false, '') })
  });
}

function saveQOpen(state: BranchState, action: Action): BranchState {
  const { payload } = action;

  const req = getSectionName(action.type);

  return updateObject(state, {
    openQuestions: payload,
    requests: updateObject(state.requests, {
      [req]: new StateRequest(undefined, false, '')
    })
  });
}

function saveQClose(state: BranchState, action: Action): BranchState {
  const { payload } = action;

  const req = getSectionName(action.type);

  return updateObject(state, {
    closeQuestions: payload,
    requests: updateObject(state.requests, {
      [req]: new StateRequest(undefined, false, '')
    })
  });
}

function saveAOpen(state: BranchState, action: Action): BranchState {
  const { payload } = action;

  const req = getSectionName(action.type);

  return updateObject(state, {
    openAnswers: payload,
    requests: updateObject(state.requests, {
      [req]: new StateRequest(undefined, false, '')
    })
  });
}

function saveAClose(state: BranchState, action: Action): BranchState {
  const { payload } = action;

  const req = getSectionName(action.type);

  return updateObject(state, {
    closeAnswers: payload,
    requests: updateObject(state.requests, {
      [req]: new StateRequest(undefined, false, '')
    })
  });
}

function saveKPI(state: BranchState, action: Action): BranchState {
  const { payload } = action;

  const req = getSectionName(action.type);

  return updateObject(state, {
    kpi: payload,
    requests: updateObject(state.requests, {
      [req]: new StateRequest(undefined, false, '')
    })
  });
}

function saveStaffRanking(state: BranchState, action: Action): BranchState {
  const { payload } = action;

  return updateObject(state, { staffRanking: payload });
}
function saveHistoric(state: BranchState, action: Action): BranchState {
  const { payload } = action;

  return updateObject(state, { staffRanking: payload });
}
