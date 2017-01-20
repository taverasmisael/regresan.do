import { Injectable } from '@angular/core';

import { APIRequestUser } from '../models/apiparams';

import {
  Response,
  Headers,
  RequestOptions,
  RequestOptionsArgs,
  Request,
  URLSearchParams
} from '@angular/http';


import { Observable } from 'rxjs/Rx';

// Auth Stuffs
import { Store } from '@ngrx/store';
import { AppState } from '../models/states/appstate';
import { JWT } from '../models/jwt';

import { ApiService } from './api.service';

@Injectable()
export class KpisService {

  private BASE_URL = 'api/Respuesta';
  private authHeader: Headers;

  constructor(private api: ApiService, store: Store<AppState>) {
    store.select<AppState>('MainStore')
      .distinctUntilKeyChanged('auth')
      .pluck<JWT>('auth', 'token')
      .subscribe(token => {
        if (token) {
          this.authHeader = new Headers({
            'Authorization': `${token.token_type} ${token.access_token}`
          });
        } else {
          this.authHeader = undefined;
        }
      });
  }

  getFromProfile(query: APIRequestUser) {
    const url = `${this.BASE_URL}/GetKpis`;
    const params = new URLSearchParams();

    params.append('_startDate', query.start);
    params.append('_endDate', query.end);
    params.append('profileId', query.profile);

    return this.api.get(url, {
      headers: this.authHeader,
      search: params
    });
  }

}
