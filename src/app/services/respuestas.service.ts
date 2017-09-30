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
import { AnswerRequest } from '@models/answerRequest'

import { ApiService } from '@services/api.service'

@Injectable()
export class RespuestasService {
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

  getFiltered(query: AnswerRequest) {
    const url = `${this.BASE_URL}/GetRespuestaByFiltro`
    const search = new URLSearchParams()
    search.append('_startDate', query.start)
    search.append('_endDate', query.end)
    search.append('profileId', query.profile)
    search.append('idPregunta', query.question)
    search.append('respuesta', query.answer)

    return this.api.get(url, {
      search,
      headers: this.authHeader
    })
  }
  getFromProfile(query: AnswerRequest) {
    const url = `${this.BASE_URL}/GetData`
    const params = new URLSearchParams()

    params.append('startDate', query.start)
    params.append('endDate', query.end)
    params.append('idprofile', query.profile)
    params.append('idQuestion', query.question)
    params.append('filterIdQuestion', query.idQuestion)
    params.append('answer', query.answer)


    return this.api.get(url, {
      headers: this.authHeader,
      search: params
    })
  }

  getOpenFromProfile(query: AnswerRequest) {
    const url = `${this.BASE_URL}/GetDataOpenQ`
    const search = new URLSearchParams()

    search.append('startDate', query.start)
    search.append('endDate', query.end)
    search.append('idprofile', query.profile)
    search.append('idQuestion', query.question)
    search.append('filterIdQuestion', query.idQuestion)
    search.append('answer', query.answer)

    return this.api.get(url, {
      search,
      headers: this.authHeader
    })
  }
}
