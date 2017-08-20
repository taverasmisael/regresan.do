import { Component, OnInit, AfterViewInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'

import { Store } from '@ngrx/store'
import { AppState } from '../models/states/appstate'
import { AuthState } from '../models/states/authstate'
import { Login, LoginFailure, LoginSuccess } from '../actions/auth.actions'

import { UserService } from '../services/user.service'

// RXJS Stuffs
import { Observable } from 'rxjs/Rx'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {
  public loginForm: FormGroup
  public username: FormControl
  public password: FormControl
  public requesting: Boolean
  public loginError: any
  public AuthState: Observable<AuthState>

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.username = new FormControl('', [Validators.required])
    this.password = new FormControl('', [Validators.required])
    this.loginForm = this.fb.group({
      username: this.username,
      password: this.password
    })
    this.AuthState = this.store.select('auth').distinctUntilKeyChanged('auth')

    this.AuthState.pluck('loading').subscribe((value: boolean) => (this.requesting = value))

    this.AuthState.pluck('error').subscribe(error => {
      switch (error) {
        case undefined || '':
          this.loginError = ''
          break
        case 'invalid_grant':
          this.loginError = 'El usuario o contraseña son incorrectos'
          break
        case 'unsupported_grant_type':
          this.loginError = 'Error Procesando la solicitud, intenta de nuevo.'
          break
        default:
          this.loginError = 'Error comunicandose con el servidor'
          break
      }
    })
  }

  ngAfterViewInit() {
    componentHandler.upgradeAllRegistered()
  }

  logUser() {
    this.store.dispatch(new Login(this.loginForm.value))
  }
}
