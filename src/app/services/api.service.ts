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

import { JWT } from '../models/jwt';

@Injectable()
export class ApiService {
  private BASE_URL: string = 'https://devregresando.azurewebsites.net';
  constructor(private http: Http) { }

  get(path: string | Request, options?: RequestOptionsArgs):Observable<{}> {
    return this.http.get(`${this.BASE_URL}/${path}`, options)
      .map(this.HandleResponse)
      .catch(this.HandleErrors);
  }

  post(path: string | Request, body: any, options?: RequestOptionsArgs):Observable<{}> {
    return this.http.post(`${this.BASE_URL}/${path}`, body, options)
      .map(this.HandleResponse)
      .catch(this.HandleErrors);
  }

  delete(path: string | Request, options?: RequestOptionsArgs):Observable<{}> {
    return this.http.delete(`${this.BASE_URL}/${path}`, options)
    .map(this.HandleResponse)
    .catch(this.HandleErrors);
  }

  put(path: string | Request, body: any, options?: RequestOptionsArgs):Observable<{}> {
    return this.http.put(`${this.BASE_URL}/${path}`, body, options)
    .map(this.HandleResponse)
    .catch(this.HandleErrors);
  }

  authorizeHeader(token: JWT): Headers {
    const newHeader = new Headers();

    newHeader.append('Authorization', `${token.token_type} ${token.access_token}`);
    return newHeader;
  }

  private HandleResponse(res: Response){
    return res.json();
  }

  private HandleErrors(error:any) {
    return Observable.throw(error.json().error || 'Server error');
  }
}
