import { Component, OnInit } from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
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
    industry: new FormControl<string>("", ),
    revenue_per_year: new FormArray(
      Array(5).fill(null).map(() => new FormControl<number>(0, { nonNullable: true, validators: [Validators.required] }))
    ),
    capital_expenditures: new FormArray(
      Array(5).fill(null).map(() => new FormControl<number>(0, { nonNullable: true, validators: [Validators.required] }))
    ),
    changes_in_working_capital: new FormArray(
      Array(5).fill(null).map(() => new FormControl<number>(0, { nonNullable: true, validators: [Validators.required] }))
    ),
    deprecation_and_amortization: new FormArray(
      Array(5).fill(null).map(() => new FormControl<number>(0, { nonNullable: true, validators: [Validators.required] }))
    ),
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
      industry: this.startupRegisterFormGroup.controls.industry.getRawValue()!,
      revenue_per_year: this.startupRegisterFormGroup.controls.revenue_per_year.getRawValue()!,
      capital_expenditures: this.startupRegisterFormGroup.controls.capital_expenditures.getRawValue()!,
      changes_in_working_capital: this.startupRegisterFormGroup.controls.changes_in_working_capital.getRawValue()!,
      deprecation_and_amortization: this.startupRegisterFormGroup.controls.deprecation_and_amortization.getRawValue()!,
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

  get revenuePerYear(): FormArray {
    return this.startupRegisterFormGroup.get('revenue_per_year') as FormArray;
  }

  get capitalExpenditures(): FormArray {
    return this.startupRegisterFormGroup.get('capital_expenditures') as FormArray;
  }

  get changesInWorkingCapital(): FormArray {
    return this.startupRegisterFormGroup.get('changes_in_working_capital') as FormArray;
  }

  get deprecationAndAmortization(): FormArray {
    return this.startupRegisterFormGroup.get('deprecation_and_amortization') as FormArray;
  }
}
