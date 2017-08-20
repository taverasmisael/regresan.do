import { Injectable } from '@angular/core'
import { CanActivate, Router } from '@angular/router'

import { Observable } from 'rxjs/Observable'

import { UserService } from '@services/user.service'

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  // Basically this canActivate makes the opposite of the AuthGuardService.canActivate
  canActivate() {
    return this.userService.isLoggedIn().map(val => {
      if (!val) {
        this.router.navigate(['login'])
      }

      return val
    })
  }
}
