import { Component } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";
import {FormType} from "../../../constants/form-type";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  constructor(private readonly authService: AuthService,
              private readonly router: Router) {
  }

  investorRegisterFormGroup = new FormGroup({
    name: new FormControl<string>("", ),
    email: new FormControl<string>("", ),
    password: new FormControl<string>("", ),
    surname: new FormControl<string>("", )
  })

  registerInvestor() {
    this.authService.registerInvestor({
      name: this.investorRegisterFormGroup.controls.name.getRawValue()!,
      surname: this.investorRegisterFormGroup.controls.surname.getRawValue()!,
      email: this.investorRegisterFormGroup.controls.email.getRawValue()!,
      password: this.investorRegisterFormGroup.controls.password.getRawValue()!,
    }).subscribe(res => {
      this.router.navigate(['']).then();
    })
  }

  protected readonly FormType = FormType;
}
