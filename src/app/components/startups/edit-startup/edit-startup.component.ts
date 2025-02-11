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
    // industry: new FormControl<string>("", ),
    revenuePerYear: new FormArray(
      Array(5).fill(null).map(() => new FormControl<number>(0, { nonNullable: true, validators: [Validators.required] }))
    ),
    capitalExpenditures: new FormArray(
      Array(5).fill(null).map(() => new FormControl<number>(0, { nonNullable: true, validators: [Validators.required] }))
    ),
    changesInWorkingCapital: new FormArray(
      Array(5).fill(null).map(() => new FormControl<number>(0, { nonNullable: true, validators: [Validators.required] }))
    ),
    deprecationAndAmortization: new FormArray(
      Array(5).fill(null).map(() => new FormControl<number>(0, { nonNullable: true, validators: [Validators.required] }))
    ),
  })

  editStartup() {
    this.startupService.update( {
      title: this.startupEditFormGroup.controls.title.getRawValue()!,
      description: this.startupEditFormGroup.controls.description.getRawValue()!,
      fundingGoal: this.startupEditFormGroup.controls.fundingGoal.getRawValue()!,
      tamMarket: this.startupEditFormGroup.controls.tam.getRawValue()!,
      samMarket: this.startupEditFormGroup.controls.sam.getRawValue()!,
      somMarket: this.startupEditFormGroup.controls.som.getRawValue()!,
      teamExperience: this.startupEditFormGroup.controls.teamExperience.getRawValue()!,
      // industry: this.startupEditFormGroup.controls.industry.getRawValue()!,
      revenuePerYear: this.startupEditFormGroup.controls.revenuePerYear.getRawValue()!,
      capitalExpenditures: this.startupEditFormGroup.controls.capitalExpenditures.getRawValue()!,
      changesInWorkingCapital: this.startupEditFormGroup.controls.changesInWorkingCapital.getRawValue()!,
      deprecationAndAmortization: this.startupEditFormGroup.controls.deprecationAndAmortization.getRawValue()!,
    }).subscribe(res => {
      this.router.navigate(['/profile']).then();
    })
  }

  ngOnInit(): void {
    // this.constantsService.getIndustryTypes().subscribe(res => {
    //   this.industryTypes = res;
    //   // this.startupEditFormGroup.controls.industry.setValue(this.industryTypes[0])
    // })
    this.route.paramMap.subscribe(params => {
      this.id = parseInt(params.get("id")!);
      this.startupService.getOne(this.id).subscribe(res => {
        console.log(res);
        this.startupEditFormGroup.setValue({
          fundingGoal: res.fundingGoal,
          title: res.title,
          description: res.description,
          tam: res.tamMarket,
          sam: res.samMarket,
          som: res.somMarket,
          teamExperience: res.teamExperience,
          // industry: res.industry,
          revenuePerYear: res.revenuePerYear,
          capitalExpenditures: res.capitalExpenditures,
          changesInWorkingCapital: res.changesInWorkingCapital,
          deprecationAndAmortization: res.deprecationAndAmortization
        })
      })
    })
  }

  industryTypes: string[] = [];

  get revenuePerYear(): FormArray {
    return this.startupEditFormGroup.get('revenuePerYear') as FormArray;
  }

  get capitalExpenditures(): FormArray {
    return this.startupEditFormGroup.get('capitalExpenditures') as FormArray;
  }

  get changesInWorkingCapital(): FormArray {
    return this.startupEditFormGroup.get('changesInWorkingCapital') as FormArray;
  }

  get deprecationAndAmortization(): FormArray {
    return this.startupEditFormGroup.get('deprecationAndAmortization') as FormArray;
  }
}
