import {Component, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {FundingRoundsService} from "../../../services/funding-rounds.service";
import {StartupService} from "../../../services/startup.service";
import { ConstantsService } from 'src/app/services/constants.service';
import { plainToInstance } from 'class-transformer';
import { UpdateStartupDto } from 'src/app/data/dtos/update-startup-dto';

@Component({
  selector: 'app-edit-startup',
  templateUrl: './edit-startup.component.html',
  styleUrls: ['./edit-startup.component.scss']
})
export class EditStartupComponent implements OnInit {

  constructor(private readonly route: ActivatedRoute,
              private readonly router: Router,
              private readonly startupService: StartupService,
              private readonly constantsService: ConstantsService) {
  }
  id?: number;

  startupEditFormGroup = new FormGroup({
    title: new FormControl<string>("", ),
    description: new FormControl<string>("", ),
    fundingGoal: new FormControl<string>("", ),
    tam: new FormControl<string>("", ),
    sam: new FormControl<string>("", ),
    som: new FormControl<string>("", ),
    teamExperience: new FormControl<string>("", ),
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

  editStartup() {
    this.startupService.update(plainToInstance(UpdateStartupDto, {
      title: this.startupEditFormGroup.controls.title.getRawValue()!,
      description: this.startupEditFormGroup.controls.description.getRawValue()!,
      funding_goal: this.startupEditFormGroup.controls.fundingGoal.getRawValue()!,
      tam: this.startupEditFormGroup.controls.tam.getRawValue()!,
      sam: this.startupEditFormGroup.controls.sam.getRawValue()!,
      som: this.startupEditFormGroup.controls.som.getRawValue()!,
      team_experience: this.startupEditFormGroup.controls.teamExperience.getRawValue()!,
      industry: this.startupEditFormGroup.controls.industry.getRawValue()!,
      revenue_per_year: this.startupEditFormGroup.controls.revenue_per_year.getRawValue()!,
      capital_expenditures: this.startupEditFormGroup.controls.capital_expenditures.getRawValue()!,
      changes_in_working_capital: this.startupEditFormGroup.controls.changes_in_working_capital.getRawValue()!,
      deprecation_and_amortization: this.startupEditFormGroup.controls.deprecation_and_amortization.getRawValue()!,
    })).subscribe(res => {
      this.router.navigate(['/profile']).then();
    })
  }

  ngOnInit(): void {
    this.constantsService.getIndustryTypes().subscribe(res => {
      this.industryTypes = res;
      // this.startupEditFormGroup.controls.industry.setValue(this.industryTypes[0])
    })
    this.route.paramMap.subscribe(params => {
      this.id = parseInt(params.get("id")!);
      this.startupService.getOne(this.id).subscribe(res => {
        console.log(res);
        this.startupEditFormGroup.setValue({
          fundingGoal: res.fundingGoal,
          title: res.title,
          description: res.description,
          tam: res.tam,
          sam: res.sam,
          som: res.som,
          teamExperience: res.teamExperience,
          industry: res.industry,
          revenue_per_year: res.revenuePerYear,
          capital_expenditures: res.capitalExpenditures,
          changes_in_working_capital: res.changesInWorkingCapital,
          deprecation_and_amortization: res.deprecationAndAmortization
        })
      })
    })
  }

  industryTypes: string[] = [];

  get revenuePerYear(): FormArray {
    return this.startupEditFormGroup.get('revenue_per_year') as FormArray;
  }

  get capitalExpenditures(): FormArray {
    return this.startupEditFormGroup.get('capital_expenditures') as FormArray;
  }

  get changesInWorkingCapital(): FormArray {
    return this.startupEditFormGroup.get('changes_in_working_capital') as FormArray;
  }

  get deprecationAndAmortization(): FormArray {
    return this.startupEditFormGroup.get('deprecation_and_amortization') as FormArray;
  }
}
