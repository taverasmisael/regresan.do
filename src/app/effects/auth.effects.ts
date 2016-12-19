import { Injectable } from '@angular/core';

import { Actions, Effect } from '@ngrx/effects';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';

import { ActionTypes, SaveUser, LoginFailure } from '../actions/auth.actions';

import { UserService } from '../services/user.service'

const { LOGIN_SUCCESS } = ActionTypes;

@Injectable()
export class AuthEffects {
  constructor(private userService: UserService, private actions$: Actions) { }

  @Effect() saveUser$ = this.actions$
    .ofType(LOGIN_SUCCESS)
    .switchMap(action => {
      return this.userService.getUserData(action.payload)
        .map(res => new SaveUser(res))
        .catch(() => Observable.of(new LoginFailure({})))
    });
}
