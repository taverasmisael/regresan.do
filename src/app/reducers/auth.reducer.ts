import { Action } from '@ngrx/store';

import { AuthState } from '../models/states/authstate';

import { ActionTypes } from '../actions/auth.actions';

const { LOGIN, LOGIN_START, LOGIN_SUCCESS, LOGIN_FAILURE,
  LOGOUT, TOKEN_EXPIRED, SAVE_USER } = ActionTypes;

import { updateObject } from '../utilities/objects';

export const INITIAL_STATE: AuthState = {
  token: undefined,
  currentUser: undefined,
  error: undefined,
  loading: false
};

export function AuthReducer() {
  return {
    [LOGIN]: loginUser,
    [LOGIN_START]: loginUser,
    [LOGIN_SUCCESS]: loginSucessful,
    [SAVE_USER]: saveUser,
    [LOGIN_FAILURE]: loginFailed,
    [LOGOUT]: logOutUser,
    [TOKEN_EXPIRED]: logOutUser

  }
}

function loginUser(state: AuthState, action: Action): AuthState {
  const { payload } = action;
  return updateObject(state, updateObject(INITIAL_STATE, {loading: true}))
}

function loginSucessful(state: AuthState, action: Action): AuthState {
  const { payload } = action;

  return updateObject(state, {token: payload});
}

function saveUser(state: AuthState, action: Action): AuthState {
  const { payload } = action;

  return updateObject(state, {currentUser: action.payload, loading: false});
}

function loginFailed(state: AuthState, action: Action): AuthState {
  const { payload } = action;

  return updateObject(state, {error: action.payload, loading: false});
}

function logOutUser(state: AuthState, action: Action): AuthState {
  return INITIAL_STATE;
}
