import { Component } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(private readonly authService: AuthService,
              private readonly router: Router) {
  }
  loginFormGroup = new FormGroup({
    email: new FormControl(""),
    password: new FormControl("")
  })

  login() {
    this.authService.login({
      email: this.loginFormGroup.controls.email.getRawValue()!,
      password: this.loginFormGroup.controls.password.getRawValue()!}
    ).subscribe(res => {
      this.router.navigate(['']).then();
    });
  }
}
