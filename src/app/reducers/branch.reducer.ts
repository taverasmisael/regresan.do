import { EnhancedAction } from '@models/enhancedAction'

import * as moment from 'moment'

import { BranchState } from '@models/states/branch'
import { StateRequest } from '@models/states/stateRequest'

import { updateObject, updateItemInArray } from '@utilities/objects'

import {
  BRANCH_REQ_QUESTIONS_R,
  BRANCH_REQ_QUESTIONS_S,
  BRANCH_REQ_QUESTIONS_E,
  BRANCH_REQ_FILTERED_R,
  BRANCH_REQ_FILTERED_S,
  BRANCH_REQ_FILTERED_E,
  BRANCH_REQ_AOPEN_R,
  BRANCH_REQ_AOPEN_S,
  BRANCH_REQ_AOPEN_E,
  BRANCH_REQ_ACLOSE_R,
  BRANCH_REQ_ACLOSE_S,
  BRANCH_REQ_ACLOSE_E,
  BRANCH_REQ_KPI_R,
  BRANCH_REQ_KPI_S,
  BRANCH_REQ_KPI_E,
  BRANCH_REQ_STAFF_RANKING_R,
  BRANCH_REQ_STAFF_RANKING_S,
  BRANCH_REQ_STAFF_RANKING_E,
  BRANCH_REQ_HISTORIC_R,
  BRANCH_REQ_HISTORIC_S,
  BRANCH_REQ_HISTORIC_E,
  BRANCH_RESET_ALL,
  BRANCH_RESET_BUT_INFO,
  BRANCH_INFO_SAVE,
  BRANCH_SAVE_CURRENT_QUERY
} from '@actions/branch.types'

export const INITIAL_STATE = new BranchState()

export function BranchCases() {
  return {
    // Resets and Saves
    [BRANCH_INFO_SAVE]: saveInfo,
    [BRANCH_RESET_ALL]: resetStore,
    [BRANCH_RESET_BUT_INFO]: resetDate,
    [BRANCH_REQ_QUESTIONS_R]: requesting,
    [BRANCH_REQ_FILTERED_R]: requesting,
    [BRANCH_REQ_AOPEN_R]: requestingAnswer,
    [BRANCH_REQ_ACLOSE_R]: requestingAnswer,
    [BRANCH_REQ_KPI_R]: requesting,
    [BRANCH_REQ_STAFF_RANKING_R]: requesting,
    [BRANCH_REQ_HISTORIC_R]: requesting,
    [BRANCH_REQ_QUESTIONS_E]: requestError,
    [BRANCH_REQ_FILTERED_E]: requestError,
    [BRANCH_REQ_AOPEN_E]: requestAnswerError,
    [BRANCH_REQ_ACLOSE_E]: requestAnswerError,
    [BRANCH_REQ_KPI_E]: requestError,
    [BRANCH_REQ_STAFF_RANKING_E]: requestError,
    [BRANCH_REQ_HISTORIC_E]: requestError,
    [BRANCH_REQ_QUESTIONS_S]: saveQuestions,
    [BRANCH_REQ_FILTERED_S]: saveFilteredQuestions,
    [BRANCH_REQ_AOPEN_S]: saveAOpen,
    [BRANCH_REQ_ACLOSE_S]: saveAClose,
    [BRANCH_REQ_KPI_S]: saveKPI,
    [BRANCH_REQ_STAFF_RANKING_S]: saveStaffRanking,
    [BRANCH_REQ_HISTORIC_S]: saveHistoric,
    [BRANCH_SAVE_CURRENT_QUERY]: saveCurrentQuery
  }
}

function saveInfo<T extends BranchState>(state: BranchState, action: EnhancedAction): BranchState {
  const { payload } = action

  return updateObject(state, { info: payload })
}

function resetStore<T extends BranchState>(
  state: BranchState,
  action: EnhancedAction
): BranchState {
  const { payload } = action

  return updateObject(state, INITIAL_STATE)
}

function resetDate<T extends BranchState>(state: BranchState, action: EnhancedAction): BranchState {
  const { payload } = action

  return Object.assign(state, INITIAL_STATE, { info: state.info })
}

function requesting<T extends BranchState>(
  state: BranchState,
  action: EnhancedAction
): BranchState {
  const { payload, message, section } = action
  let update = {
    requests: updateObject(state.requests, {
      [section]: new StateRequest(undefined, true, message)
    })
  }
  if (section === 'QUESTIONS') {
    update = updateObject(update, { closeQuestions: [], openAnswers: [] })
  }

  return updateObject(state, update)
}

function requestingAnswer<T extends BranchState>(
  state: BranchState,
  action: EnhancedAction
): BranchState {
  const { payload, message, section } = action

  return updateObject(state, {
    requests: updateObject(state.requests, {
      [section]: [
        ...state.requests[section],
        new StateRequest(undefined, true, message, payload.pregunta)
      ]
    })
  })
}

function requestAnswerError<T extends BranchState>(
  state: BranchState,
  action: EnhancedAction
): BranchState {
  const { payload, message, section } = action

  return updateObject(state, {
    requests: updateObject(state.requests, {
      [section]: [
        ...state.requests[section],
        new StateRequest(payload, false, '', payload.pregunta)
      ]
    })
  })
}

function requestError<T extends BranchState>(
  state: BranchState,
  action: EnhancedAction
): BranchState {
  const { payload, section } = action

  return updateObject(state, {
    requests: updateObject(state.requests, { [section]: new StateRequest(payload, false, '') })
  })
}

function saveQuestions<T extends BranchState>(
  state: BranchState,
  action: EnhancedAction
): BranchState {
  const { payload, section } = action

  return updateObject(state, {
    openQuestions: payload.open,
    closeQuestions: payload.close,
    requests: updateObject(state.requests, {
      [section]: new StateRequest(undefined, false, '')
    })
  })
}

function saveFilteredQuestions<T extends BranchState>(
  state: BranchState,
  action: EnhancedAction
): BranchState {
  const { payload, section } = action
  console.log(section, payload)
  return state;
}

function saveQClose<T extends BranchState>(
  state: BranchState,
  action: EnhancedAction
): BranchState {
  const { payload, section } = action

  return updateObject(state, {
    closeQuestions: payload,
    requests: updateObject(state.requests, {
      [section]: new StateRequest(undefined, false, '')
    })
  })
}

function saveAOpen<T extends BranchState>(state: BranchState, action: EnhancedAction): BranchState {
  const { payload, section } = action
  const { answer, question } = payload

  return updateObject(state, {
    openAnswers: [...state.openAnswers, answer],
    requests: updateObject(state.requests, {
      [section]: state.requests[section].map((sr: StateRequest) => {
        if (sr.id === question) {
          return updateObject(sr, { isLoading: false, error: undefined, text: '' })
        } else {
          return sr
        }
      })
    })
  })
}

function saveAClose<T extends BranchState>(
  state: BranchState,
  action: EnhancedAction
): BranchState {
  const { payload, section } = action
  const { answer, question } = payload

  return updateObject(state, {
    closeAnswers: [...state.closeAnswers, answer],
    requests: updateObject(state.requests, {
      [section]: state.requests[section].map((sr: StateRequest) => {
        if (sr.id === question) {
          return updateObject(sr, { isLoading: false, error: undefined, text: '' })
        } else {
          return sr
        }
      })
    })
  })
}

function saveKPI<T extends BranchState>(state: BranchState, action: EnhancedAction): BranchState {
  const { payload, section } = action

  return updateObject(state, {
    kpis: payload,
    requests: updateObject(state.requests, {
      [section]: new StateRequest(undefined, false, '')
    })
  })
}

function saveStaffRanking<T extends BranchState>(
  state: BranchState,
  action: EnhancedAction
): BranchState {
  const { payload, section } = action

  return updateObject(state, {
    staffRanking: payload,
    requests: updateObject(state.requests, {
      [section]: new StateRequest(undefined, false, '')
    })
  })
}
function saveHistoric<T extends BranchState>(
  state: BranchState,
  action: EnhancedAction
): BranchState {
  const { payload, section } = action
  return updateObject(state, {
    historicData: payload,
    requests: updateObject(state.requests, {
      [section]: new StateRequest(undefined, false, '')
    })
  })
}

function saveCurrentQuery<T extends BranchState>(
  state: BranchState,
  action: EnhancedAction
): BranchState {
  const { payload } = action
  return updateObject(state, {
    currentQuery: payload
  })
}
