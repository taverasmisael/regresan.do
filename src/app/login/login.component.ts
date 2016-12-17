import { Component, OnInit } from '@angular/core';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  username: FormControl;
  password: FormControl;

  constructor(fb: FormBuilder) {
    this.username = new FormControl('', [ Validators.required ]);
    this.password = new FormControl('', [ Validators.required ]);
    this.loginForm = fb.group({
      username: this.username,
      password: this.password
    });
  }

  ngOnInit() {
    console.log(`Initializing 'LoginComponent'`);
  }

  logUser() {
    console.log(this.loginForm.value);
  }

}
