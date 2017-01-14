import { Injectable } from '@angular/core';

import {
  Response,
  Headers,
  RequestOptions,
  RequestOptionsArgs,
  Request
} from '@angular/http';

import {Observable} from 'rxjs/Rx';

import { Store } from '@ngrx/store';
import { AppState } from '../models/states/appstate';
import { AuthState } from '../models/states/authstate';

import { IUserLoginCredentials } from '../models/iuser-login-credentials';
import { JWT } from '../models/jwt';

import {ApiService} from './api.service';

@Injectable()
export class UserService {

  constructor(private api: ApiService, private store: Store<AppState>) { }

  login(creds: IUserLoginCredentials) {
    let credentials = Object.assign({}, creds, {
      grant_type: 'password'
    });
    const body = this.api.encodeBody(credentials);
    return this.api.post('token', body);
  }

  getUserData(token: JWT) {
    const header = this.api.authorizeHeader(token);
    return this.api.get('api/User/GetFullUser', {
      headers: header
    });
  }

  isLoggedIn() {
    return this.store.select<AppState>('MainStore')
      .map(({auth}) => (!!auth && !!auth.token));
  }
}
