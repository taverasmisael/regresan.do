import { Action } from '@ngrx/store';

import { AuthState } from '../models/authstate';

import { ActionTypes } from '../actions/auth.actions';

const { LOGIN, LOGIN_START, LOGIN_SUCCESS, LOGIN_FAILURE,
  LOGOUT, TOKEN_EXPIRED, SAVE_USER } = ActionTypes;

import { updateObject } from '../utilities/objects';

const INITIAL_STATE: AuthState = {
  token: null,
  currentUser: null,
  error: null,
  loading: false
};

export default function AuthReducer(state = INITIAL_STATE, action: Action) {
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
  return updateObject(state, {loading: true});
}

function loginSucessful(state: AuthState, action: Action): AuthState {
  return updateObject(state, {token: action.payload, loading: false});
}

function saveUser(state: AuthState, action: Action): AuthState {
  return updateObject(state, {token: action.payload, loading: false});
}

function loginFailed(state: AuthState, action: Action): AuthState {
  return updateObject(state, {currentUser: action.payload, loading: false});
}

function logOutUser(state: AuthState, action: Action): AuthState {
  return INITIAL_STATE;
}
