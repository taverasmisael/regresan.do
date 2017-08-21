import { Injectable } from '@angular/core'
import { Router } from '@angular/router'

import { Actions, Effect } from '@ngrx/effects'

import { Observable } from 'rxjs/Observable'

import { ActionTypes, SaveUser, LoginFailure, LoginSuccess } from '../actions/auth.actions'

import { UserService } from '../services/user.service'

const { LOGIN_SUCCESS, SAVE_USER, LOGIN_START, LOGOUT, LOGOUT_START, LOGIN } = ActionTypes

@Injectable()
export class AuthEffects {
  @Effect()
  loginUser = this.actions$.ofType(LOGIN).switchMap(action => {
    return this.userService
      .login(action['payload'])
      .map(res => new LoginSuccess(res))
      .catch(err => Observable.of(new LoginFailure(err)))
  })

  @Effect()
  getUserData$ = this.actions$.ofType(LOGIN_SUCCESS).switchMap(action => {
    return this.userService
      .getUserData(action['payload'])
      .map(res => new SaveUser(res))
      .catch(() => Observable.of(new LoginFailure({})))
  })

  @Effect()
  saveUser$ = this.actions$.ofType(SAVE_USER).switchMap(action => {
    this.router.navigate(['dashboard'])
    return Observable.of({ type: false })
  })

  @Effect()
  logoutUser = this.actions$.ofType(LOGOUT_START).switchMap(action => {
    this.router.navigate(['login'])
    return Observable.of({ type: LOGOUT })
  })

  constructor(
    private userService: UserService,
    private actions$: Actions,
    private router: Router
  ) {}
}
