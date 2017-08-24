import { Injectable } from '@angular/core'

import { Response, Headers, RequestOptions, RequestOptionsArgs, Request } from '@angular/http'

import { Observable } from 'rxjs/Rx'

import { Store } from '@ngrx/store'
import { AES } from 'crypto-js'

import { AppState } from '@models/states/app'
import { AuthState } from '@models/states/auth'

import { LoginCredentials } from '@models/loginCredentials'
import { JWT } from '@models/jwt'

import { ApiService } from '@services/api.service'

@Injectable()
export class UserService {
  private SecretKey = '123456*Abcd$'
  constructor(private api: ApiService, private store: Store<AppState>) {}

  login(creds: LoginCredentials) {
    const encripted = this.encryptCredentials(creds)
    let credentials = {
      ...encripted,
      grant_type: 'password'
    }
    const body = this.api.encodeBody(credentials)
    return this.api.post('token', body)
  }

  getUserData(token: JWT) {
    const header = this.api.authorizeHeader(token)
    return this.api.get('api/User/GetFullUser', {
      headers: header
    })
  }

  isLoggedIn() {
    return this.store.select('auth').map(auth => !!auth && !!auth.token)
  }

  private encryptCredentials(credentials: LoginCredentials): LoginCredentials {
    const username = AES.encrypt(credentials.username, this.SecretKey).toString()
    const password = AES.encrypt(credentials.password, this.SecretKey).toString()
    return new LoginCredentials(username, password)
  }
}
