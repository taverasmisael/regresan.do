import { EnhancedAction } from '@models/enhancedAction'

import * as moment from 'moment'
import { flatten, map, filter, reduce } from 'ramda'

import { BranchState } from '@models/states/branch'
import { StateRequest } from '@models/states/stateRequest'

import { updateObject, updateItemInArray } from '@utilities/objects'
import { uniqueValue } from '@utilities/arrays'
import { createReducer } from '@utilities/reducers'

import * as ACTIONS from '@actions/branch.types'

interface FlattenAnswer {
  IdPregunta: number
  Pregunta: string
  respuesta: String
}
export const INITIAL_STATE = new BranchState()

export function BranchReducer(state = INITIAL_STATE, action: EnhancedAction) {
  const Cases = {
    [ACTIONS.BRANCH_INFO_SAVE]: saveInfo,
    [ACTIONS.BRANCH_RESET_ALL]: resetStore,
    [ACTIONS.BRANCH_RESET_BUT_INFO]: resetDate,
    [ACTIONS.BRANCH_REQ_QUESTIONS_R]: requesting,
    [ACTIONS.BRANCH_REQ_FILTERED_R]: requesting,
    [ACTIONS.BRANCH_REQ_AOPEN_R]: requestingAnswer,
    [ACTIONS.BRANCH_REQ_ACLOSE_R]: requestingAnswer,
    [ACTIONS.BRANCH_REQ_KPI_R]: requesting,
    [ACTIONS.BRANCH_REQ_STAFF_RANKING_R]: requesting,
    [ACTIONS.BRANCH_REQ_HISTORIC_R]: requesting,
    [ACTIONS.BRANCH_REQ_FILTER_Q_R]: requesting,
    [ACTIONS.BRANCH_REQ_QUESTIONS_E]: requestError,
    [ACTIONS.BRANCH_REQ_FILTERED_E]: requestError,
    [ACTIONS.BRANCH_REQ_AOPEN_E]: requestAnswerError,
    [ACTIONS.BRANCH_REQ_ACLOSE_E]: requestAnswerError,
    [ACTIONS.BRANCH_REQ_KPI_E]: requestError,
    [ACTIONS.BRANCH_REQ_STAFF_RANKING_E]: requestError,
    [ACTIONS.BRANCH_REQ_HISTORIC_E]: requestError,
    [ACTIONS.BRANCH_REQ_FILTER_Q_E]: requestError,
    [ACTIONS.BRANCH_REQ_QUESTIONS_S]: saveQuestions,
    [ACTIONS.BRANCH_REQ_FILTERED_S]: saveFilteredQuestions,
    [ACTIONS.BRANCH_REQ_AOPEN_S]: saveAOpen,
    [ACTIONS.BRANCH_REQ_ACLOSE_S]: saveAClose,
    [ACTIONS.BRANCH_REQ_KPI_S]: saveKPI,
    [ACTIONS.BRANCH_REQ_STAFF_RANKING_S]: saveStaffRanking,
    [ACTIONS.BRANCH_REQ_FILTER_Q_S]: saveFilterQuestions,
    [ACTIONS.BRANCH_REQ_HISTORIC_S]: saveHistoric,
    [ACTIONS.BRANCH_SAVE_CURRENT_QUERY]: saveCurrentQuery
  }
  return Cases.hasOwnProperty(action.type)
    ? Cases[action.type](state, action)
    : defaultCase(state, action)
}

function defaultCase<T extends BranchState>(
  state: BranchState,
  action: EnhancedAction
): BranchState {
  return state
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

function saveFilterQuestions<T extends BranchState>(
  state: BranchState,
  action: EnhancedAction
): BranchState {
  const { payload, section } = action

  const flatAnswers: FlattenAnswer[] = flatten(
    map(
      d => map(a => ({ IdPregunta: d.IdPregunta, Pregunta: d.Pregunta, ...a }), d.Respuestas),
      payload
    )
  )
  const mappedQuestions = payload
    .map(({ IdPregunta: value, Pregunta: text }) => ({ value, text }))
    .map(q => {
      const myAnswer = flatAnswers.filter(a => a.IdPregunta === q.value)
      if (myAnswer) {
        const children = myAnswer.map(({ respuesta: value, respuesta: text }) => ({
          value,
          text
        }))
        return { ...q, children }
      }
    })
    .filter(q => !!q.children.length)

  const questionsList = reduce(uniqueValue, [], [...mappedQuestions])

  return updateObject(state, {
    filterQuestions: questionsList,
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
  return state
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
