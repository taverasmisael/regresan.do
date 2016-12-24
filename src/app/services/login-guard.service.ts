import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { Store } from '@ngrx/store';
import { AppState } from '../models/appstate';

@Injectable()
export class LoginGuardService implements CanActivate {

  private state: Observable<AppState>;

  constructor(private store: Store<AppState>, private router: Router) {
    this.state = store.select<AppState>('MainStore');
  }

  // Basically this canActivate makes the opposite of the AuthGuardService.canActivate
  canActivate() {
    return this.state.map(({auth}) => {
      if (!!auth && !!auth.token) {
        this.router.navigate(['/dashboard']);
        return false;
      } else {
        return true;
      }
    })
  }
}
