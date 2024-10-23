import { Component } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";
import {InvestorsService} from "../../../services/investors.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  constructor(private readonly authService: AuthService,
              private readonly investorsService: InvestorsService,
              private readonly router: Router) {
  }

  investorRegisterFormGroup = new FormGroup({
    name: new FormControl<string>("", ),
    email: new FormControl<string>("", ),
    password: new FormControl<string>("", ),
    surname: new FormControl<string>("", )
  })

  startupRegisterFormGroup = new FormGroup({
    email: new FormControl<string>("", ),
    password: new FormControl<string>("", ),
    title: new FormControl<string>("", ),
    description: new FormControl<string>("", ),
    fundingGoal: new FormControl<string>("", ),
    tam_market: new FormControl<string>("", ),
    sam_market: new FormControl<string>("", ),
    som_market: new FormControl<string>("", )
  })

  registerStartup() {
    this.authService.registerStartup({
      title: this.startupRegisterFormGroup.controls.title.getRawValue()!,
      description: this.startupRegisterFormGroup.controls.description.getRawValue()!,
      email: this.startupRegisterFormGroup.controls.email.getRawValue()!,
      password: this.startupRegisterFormGroup.controls.password.getRawValue()!,
      fundingGoal: this.startupRegisterFormGroup.controls.fundingGoal.getRawValue()!,
      tam_market: this.startupRegisterFormGroup.controls.tam_market.getRawValue()!,
      sam_market: this.startupRegisterFormGroup.controls.sam_market.getRawValue()!,
      som_market: this.startupRegisterFormGroup.controls.som_market.getRawValue()!,
    }).subscribe(res => {
      this.router.navigate(['']).then();
    })
  }

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
}
