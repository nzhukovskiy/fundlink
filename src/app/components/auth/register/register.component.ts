import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";
import {InvestorsService} from "../../../services/investors.service";
import { plainToInstance } from 'class-transformer';
import { CreateStartupDto } from 'src/app/data/dtos/create-startup.dto';
import { ConstantsService } from 'src/app/services/constants.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  constructor(private readonly authService: AuthService,
              private readonly investorsService: InvestorsService,
              private readonly constantsService: ConstantsService,
              private readonly router: Router) {
  }
  ngOnInit(): void {
    this.constantsService.getIndustryTypes().subscribe(res => {
      this.industryTypes = res;
      this.startupRegisterFormGroup.controls.industry.setValue(this.industryTypes[0])
    })
  }

  industryTypes: string[] = [];

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
    tam: new FormControl<string>("", ),
    sam: new FormControl<string>("", ),
    som: new FormControl<string>("", ),
    teamExperience: new FormControl<number>(0, ),
    industry: new FormControl<string>("", )
  })

  registerStartup() {
    console.log(this.startupRegisterFormGroup.controls.industry.getRawValue()!)
    this.authService.registerStartup(plainToInstance(CreateStartupDto, {
      title: this.startupRegisterFormGroup.controls.title.getRawValue()!,
      description: this.startupRegisterFormGroup.controls.description.getRawValue()!,
      email: this.startupRegisterFormGroup.controls.email.getRawValue()!,
      password: this.startupRegisterFormGroup.controls.password.getRawValue()!,
      funding_goal: this.startupRegisterFormGroup.controls.fundingGoal.getRawValue()!,
      tam: this.startupRegisterFormGroup.controls.tam.getRawValue()!,
      sam: this.startupRegisterFormGroup.controls.sam.getRawValue()!,
      som: this.startupRegisterFormGroup.controls.som.getRawValue()!,
      team_experience: this.startupRegisterFormGroup.controls.teamExperience.getRawValue()!,
      industry: this.startupRegisterFormGroup.controls.industry.getRawValue()!
    })).subscribe(res => {
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
