import { Injectable } from '@angular/core';

import {
  Response,
  Headers,
  RequestOptions,
  RequestOptionsArgs,
  Request } from '@angular/http';

// RXJS Stuffs
import {Observable} from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { IUserLoginCredentials } from '../models/iuser-login-credentials';
import { JWT } from '../models/jwt';

import {ApiService} from './api.service';

@Injectable()
export class UserService {

  constructor(private api: ApiService) { }

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
}
