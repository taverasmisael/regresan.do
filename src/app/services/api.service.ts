import { Injectable } from '@angular/core';

import {
  Http,
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

import { updateObject } from '../utilities/objects';
import { JWT } from '../models/jwt';

@Injectable()
export class ApiService {
  private BASE_URL: string = 'https://devregresando.azurewebsites.net';
  private COMMON_HEADERS = new Headers([{'Content-Type': 'application/x-www-form-urlencoded'}]);
  constructor(private http: Http) { }

  get(path: string | Request, options?: RequestOptionsArgs):Observable<{}> {
    return this.http.get(`${this.BASE_URL}/${path}`, options)
      .map(this.HandleResponse)
      .catch(this.HandleErrors);
  }

  post(path: string | Request, body: any, options?: RequestOptionsArgs):Observable<{}> {
    // This Line Ensure All 'FormRequest' are sended with the right content-type
    const innerOptions = updateObject({headers: this.COMMON_HEADERS}, options);
    return this.http.post(`${this.BASE_URL}/${path}`, body, innerOptions)
      .map(this.HandleResponse)
      .catch(this.HandleErrors);
  }

  delete(path: string | Request, options?: RequestOptionsArgs):Observable<{}> {
    // This Line Ensure All 'FormRequest' are sended with the right content-type
    const innerOptions = updateObject({headers: this.COMMON_HEADERS}, options);
    return this.http.delete(`${this.BASE_URL}/${path}`, innerOptions)
    .map(this.HandleResponse)
    .catch(this.HandleErrors);
  }

  put(path: string | Request, body: any, options?: RequestOptionsArgs):Observable<{}> {
    // This Line Ensure All 'FormRequest' are sended with the right content-type
    const innerOptions = updateObject({headers: this.COMMON_HEADERS}, options);
    return this.http.put(`${this.BASE_URL}/${path}`, body, innerOptions)
    .map(this.HandleResponse)
    .catch(this.HandleErrors);
  }

  authorizeHeader(token: JWT): Headers {
    const newHeader = new Headers();

    newHeader.append('Authorization', `${token.token_type} ${token.access_token}`);
    return newHeader;
  }

  encodeBody(body: Object) {
    let encoded = '';

    Object.keys(body).forEach(key => {
      encoded += `${key}=${body[key]}&`
    });
    return encoded.slice(0, -1);
  }

  private HandleResponse(res: Response) {
    return res.json();
  }

  private HandleErrors(error: any) {
    const err = {
      status: error.status,
      message: error.json().error,
      text: error.statusText
    }
    return Observable.throw(err);
  }
}
