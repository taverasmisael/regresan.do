import { Action } from '@models/action'

import { AuthState } from '@models/states/auth'

import { ActionTypes } from '@actions/auth.actions'

import { createReducer } from '@utilities/reducers'

const {
  LOGIN,
  LOGIN_START,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  TOKEN_EXPIRED,
  SAVE_USER
} = ActionTypes

import { updateObject } from '@utilities/objects'

export const INITIAL_STATE = new AuthState()

export function AuthReducer(state = INITIAL_STATE, action) {
  const Cases = {
    [LOGIN]: loginUser,
    [LOGIN_START]: loginUser,
    [LOGIN_SUCCESS]: loginSucessful,
    [SAVE_USER]: saveUser,
    [LOGIN_FAILURE]: loginFailed,
    [LOGOUT]: logOutUser,
    [TOKEN_EXPIRED]: logOutUser
  }

  return Cases.hasOwnProperty(action.type) ? Cases[action.type](state, action) : defaultCase(state, action)
}

function defaultCase<T extends AuthState>(state: T, action: Action): T {
  const { payload } = action
  return state
}

function loginUser<T extends AuthState>(state: T, action: Action): T {
  const { payload } = action
  return updateObject(state, updateObject(INITIAL_STATE, { loading: true }))
}

function loginSucessful<T extends AuthState>(state: T, action: Action): T {
  const { payload } = action

  return updateObject(state, { token: payload })
}

function saveUser<T extends AuthState>(state: T, action: Action): T {
  const { payload } = action

  return updateObject(state, { currentUser: action.payload, loading: false })
}

function loginFailed<T extends AuthState>(state: T, action: Action): T {
  const { payload } = action

  return updateObject(state, { error: action.payload, loading: false })
}

function logOutUser<T extends AuthState>(state: AuthState, action: Action): AuthState {
  return INITIAL_STATE
}
