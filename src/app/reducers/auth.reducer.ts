import { Action } from '@ngrx/store';

import { AuthState } from '../models/authstate';
import { AppState } from '../models/appstate';

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

function loginUser(state: AppState, action: Action): AppState {
  const { payload } = action;
  const newState: AppState = {
    auth: updateObject(state.auth, updateObject(INITIAL_STATE, {loading: true}))
  }
  return newState;
}

function loginSucessful(state: AppState, action: Action): AppState {
  const { payload } = action;
  const newState: AppState = {
    auth: updateObject(state.auth, {token: payload, loading: false})
  }
  return newState;
}

function saveUser(state: AppState, action: Action): AppState {
  const { payload } = action;
  const newState: AppState = {
    auth: updateObject(state.auth, {currentUser: action.payload, loading: false})
  }
  return newState;
}

function loginFailed(state: AppState, action: Action): AppState {
  const { payload } = action;
  const newState: AppState = {
    auth: updateObject(state.auth, {error: action.payload, loading: false})
  }
  return newState;
}

function logOutUser(state: AppState, action: Action): AppState {
  const newState: AppState = {
    auth: INITIAL_STATE
  };
  return newState;
}
