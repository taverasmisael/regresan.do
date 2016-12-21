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

// Auth Stuffs
import { Store } from '@ngrx/store';
import { AppState } from '../models/appstate';
import { JWT } from '../models/jwt';

import {ApiService} from './api.service';

@Injectable()
export class RespuestasService {
  private BASE_URL = 'api/Respuesta';
  private authHeader: Headers;
  constructor(private api: ApiService, store: Store<AppState>) {
    store.select<AppState>('MainStore')
      .map(slice => slice.auth)
      .subscribe(val => {
        const {access_token: token, token_type: type} = val.token
        this.authHeader = new Headers({'Authorization': `${type} ${token}`});
      })
  }

  getAll(start: string | Date, end: string | Date) {
    let request = `${this.BASE_URL}/GetTotalEncuestasbySucursalesPie2`;
    const THE_URL = `${request}?_startDate=${start}&_endDate=${end}`

    return this.api.get(THE_URL, {
      headers: this.authHeader
    });
  }
}