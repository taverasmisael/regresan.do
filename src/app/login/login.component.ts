import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

import { Store } from '@ngrx/store';
import { AppState } from '../models/appstate';
import { AuthState } from '../models/authstate';
import { Login, LoginFailure, LoginSuccess } from '../actions/auth.actions';

import { UserService } from '../services/user.service';


// RXJS Stuffs
import {Observable} from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  username: FormControl;
  password: FormControl;
  private requesting: Boolean;
  private loginError: any;
  private Store: Observable<AppState>;

  constructor(private fb: FormBuilder,
    private userService: UserService,
    private store: Store<AppState>) { }

  ngOnInit() {
    console.log(`Initializing 'LoginComponent'`);
    this.username = new FormControl('', [ Validators.required ]);
    this.password = new  FormControl('', [ Validators.required ]);
    this.loginForm = this.fb.group({
      username: this.username,
      password: this.password
    });

    this.Store  = this.store.select<AppState>('MainStore');
    this.Store.subscribe(console.log.bind(console));
    this.Store.map(({auth}) => auth? auth.loading : undefined).subscribe(value => this.requesting = value);
    this.Store.map(({auth}) => auth? auth.error : undefined).subscribe(error=> {
      switch (error) {
        case(undefined): {
          this.loginError = '';
          break;
        }
        case('invalid_grant'): {
          this.loginError = 'El usuario o contraseña son incorrectos';
          break;
        }
        case('unsupported_grant_type'): {
          this.loginError = 'Error Procesando la solicitud, intenta de nuevo.';
          break;
        }
        default: {
          this.loginError = 'Error comunicandose con el servidor';
          break;
        }
      }
    });
  }

  logUser() {
    this.store.dispatch(new Login(this.loginForm.value));
    this.userService.login(this.loginForm.value)
      .subscribe(
        access => {this.store.dispatch(new LoginSuccess(access))},
        error => {this.store.dispatch(new LoginFailure(error))},
        () => console.log('DONE!')
      );
  }
}
