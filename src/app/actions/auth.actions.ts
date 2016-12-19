import { Action } from '@ngrx/store';

export const ActionTypes = {
  LOGIN: '[AUTH]: LOGIN',
  LOGIN_START: '[AUTH]: LOGIN_START',
  LOGIN_SUCCESS: '[AUTH]: LOGIN_SUCCESS',
  LOGIN_FAILURE: '[AUTH]: LOGIN_FAILURE',
  LOGOUT: '[AUTH]: LOGOUT',
  TOKEN_EXPIRED: '[AUTH] TOKEN_EXPIRED:',
  SAVE_USER: '[AUTH] SAVE_USER:',
};

export class Login implements Action {
  type = ActionTypes.LOGIN;

  constructor(public payload) {}
}

export class LoginFailure implements Action {
  type = ActionTypes.LOGIN_FAILURE;

  constructor(public payload) {}
}

export class LoginSuccess implements Action {
  type = ActionTypes.LOGIN_SUCCESS;

  constructor(public payload) {}
}
