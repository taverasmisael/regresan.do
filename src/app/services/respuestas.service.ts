import { Injectable } from '@angular/core';

import { APIRequestRespuesta } from '../models/apiparams';

import {
  Response,
  Headers,
  RequestOptions,
  RequestOptionsArgs,
  Request,
  URLSearchParams
} from '@angular/http';

// RXJS Stuffs
import { Observable } from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

// Auth Stuffs
import { Store } from '@ngrx/store';
import { AppState } from '../models/states/appstate';
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

getFromProfile(query: APIRequestRespuesta) {
    const url = `${this.BASE_URL}/GetRespuestasByProfiles2`;
    const params = new URLSearchParams();

    params.append('_startDate', query.start);
    params.append('_endDate', query.end);
    params.append('profileId', query.profile);
    params.append('idPregunta', query.pregunta);

    return this.api.get(url, {
      headers: this.authHeader,
      search: params
    });
  }

  getAbiertasFromProfile(query: APIRequestRespuesta) {
    const url = `${this.BASE_URL}/GetRespuestasByProfilesAbierta2`;
    const params = new URLSearchParams();

    params.append('_startDate', query.start);
    params.append('_endDate', query.end);
    params.append('profileId', query.profile);
    params.append('idPregunta', query.pregunta);

    return this.api.get(url, {
      headers: this.authHeader,
      search: params
    });
  }
}
