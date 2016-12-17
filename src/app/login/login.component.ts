import { Component, OnInit } from '@angular/core';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

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
  private requesting = false;
  private loginError: string;

  constructor(fb: FormBuilder, private userService: UserService) {
    this.username = new FormControl('', [ Validators.required ]);
    this.password = new  FormControl('', [ Validators.required ]);
    this.loginForm = fb.group({
      username: this.username,
      password: this.password
    });
  }

  ngOnInit() {
    console.log(`Initializing 'LoginComponent'`);
  }

  logUser() {
    this.requesting = true;
    this.loginError = undefined;
    this.userService.login(this.loginForm.value)
      .subscribe(
        success => {console.log(success); this.requesting = false;},
        error => {this.showError(error); this.requesting = false;},
        () => console.log('DONE!')
      );
  }

  showError(error: any) {
    console.error(error);
    switch (error) {
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
  }

}
