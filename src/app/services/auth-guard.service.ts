import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { Store } from '@ngrx/store';
import { AppState } from '../models/appstate';

@Injectable()
export class AuthGuardService implements CanActivate {

  private state: Observable<AppState>;

  constructor(private store: Store<AppState>, private router: Router) {
    this.state = store.select<AppState>('MainStore');
  }

  canActivate() {
    return this.state.map(state => {
      if (!!state.auth.token) {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    })
  }
}
