import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Actions, Effect } from '@ngrx/effects';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';

import { ActionTypes, SaveUser, LoginFailure } from '../actions/auth.actions';

import { UserService } from '../services/user.service'

const { LOGIN_SUCCESS, SAVE_USER, LOGIN_START } = ActionTypes;

@Injectable()
export class AuthEffects {
  constructor(private userService: UserService,
    private actions$: Actions,
    private router: Router) { }

  @Effect() loginUser$ = this.actions$
    .ofType(LOGIN_SUCCESS)
    .switchMap(action => {
      console.info('I am going to fetch UserData....')
      return this.userService.getUserData(action.payload)
        .map(res => new SaveUser(res))
        .catch(() => Observable.of(new LoginFailure({})))
    });

  @Effect() saveUser$ = this.actions$
    .ofType(SAVE_USER)
    .switchMap(action => {
      this.router.navigate(['dashboard']);
      return Observable.of({type: false});
    });
}
