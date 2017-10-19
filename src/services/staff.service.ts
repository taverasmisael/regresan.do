import { Injectable } from '@angular/core'

import {
  Response,
  Headers,
  RequestOptions,
  RequestOptionsArgs,
  Request,
  URLSearchParams
} from '@angular/http'

import { Observable } from 'rxjs/Rx'
import { Store } from '@ngrx/store'

// Auth Stuffs
import { AppState } from '@models/states/app'
import { JWT } from '@models/jwt'
import { StandardRequest } from '@models/standardRequest'

import { ApiService } from '@services/api.service'

@Injectable()
export class StaffService {
  private BASE_URL = 'api/Respuesta'
  private authHeader: Headers

  constructor(private api: ApiService, store: Store<AppState>) {
    store.select('auth').subscribe(({ token }) => {
      if (token) {
        this.authHeader = new Headers({
          Authorization: `${token.token_type} ${token.access_token}`
        })
      } else {
        this.authHeader = undefined
      }
    })
  }

  getKpisCamareros(query: StandardRequest) {
    const url = `${this.BASE_URL}/GetKpisCamareros`
    const params = new URLSearchParams()

    params.append('_startDate', query.start)
    params.append('_endDate', query.end)
    params.append('_profileId', query.profile)

    return this.api.get(url, {
      headers: this.authHeader,
      search: params
    })
  }
}
