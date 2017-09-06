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

import { AppState } from '@models/states/app'
import { JWT } from '@models/jwt'
import { StandardRequest } from '@models/standardRequest'
import { BasicRequest } from '@models/basicRequest'

import { ApiService } from './api.service'

@Injectable()
export class QuestionsService {
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

  getAll(query: StandardRequest) {
    const url = `${this.BASE_URL}/GetTotalEncuestasbySucursalesPie2`
    const params = new URLSearchParams()

    params.append('_startDate', query.start)
    params.append('_endDate', query.end)

    return this.api.get(url, {
      headers: this.authHeader,
      search: params
    })
  }

  getAllByProfile(query: StandardRequest) {
    const url = `${this.BASE_URL}/GetPreguntasByProfile2`
    const params = new URLSearchParams()

    params.append('_startDate', query.start)
    params.append('_endDate', query.end)
    params.append('profileId', query.profile)

    return this.api.get(url, {
      headers: this.authHeader,
      search: params
    })
  }

  getTotalPorDia(query: BasicRequest) {
    const url = `${this.BASE_URL}/GetTotalEncuestasxDia2`
    const params = new URLSearchParams()
    params.append('_startDate', query.start)
    params.append('_endDate', query.end)

    return this.api.get(url, {
      headers: this.authHeader,
      search: params
    })
  }

  getResumen(query: BasicRequest) {
    const url = `${this.BASE_URL}/GetDatosCabecera2`
    const params = new URLSearchParams()
    params.append('_startDate', query.start)
    params.append('_endDate', query.end)

    return this.api.get(url, {
      headers: this.authHeader,
      search: params
    })
  }

  getResumenSucursal(query: StandardRequest) {
    const url = `${this.BASE_URL}/GetDatosCabecerabyProfileId2`
    const params = new URLSearchParams()
    params.append('_startDate', query.start)
    params.append('_endDate', query.end)
    params.append('_profileId', query.profile)

    return this.api.get(url, {
      headers: this.authHeader,
      search: params
    })
  }

  getRankingCamareros(query: StandardRequest) {
    const url = `${this.BASE_URL}/GetRankingCamareros`
    const params = new URLSearchParams()
    params.append('_startDate', query.start)
    params.append('_endDate', query.end)
    params.append('profileId', query.profile)

    return this.api.get(url, {
      headers: this.authHeader,
      search: params
    })
  }
}
