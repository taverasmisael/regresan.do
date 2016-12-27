import { Injectable } from '@angular/core';

import {
  Response,
  Headers,
  RequestOptions,
  RequestOptionsArgs,
  Request
} from '@angular/http';

// RXJS Stuffs
import { Observable } from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

// Auth Stuffs
import { Store } from '@ngrx/store';
import { AppState } from '../models/appstate';
import { JWT } from '../models/jwt';

import { ApiService } from './api.service';

@Injectable()
export class RespuestasService {
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

  getAll(start: string | number, end: string | number) {
    let url = `${this.BASE_URL}/GetTotalEncuestasbySucursalesPie2`;

    return this.api.get(url, {
      headers: this.authHeader,
      search: `_startDate=${start}&_endDate=${end}`
    });
  }

  getAllByProfile(profile: number, start: string | number, end: string | number) {
    let url = `${this.BASE_URL}/GetPreguntasByProfile2`;

    return this.api.get(url, {
      headers: this.authHeader,
      search: `profileId=${profile}&_startDate=${start}&_endDate=${end}`
    });
  }
}
