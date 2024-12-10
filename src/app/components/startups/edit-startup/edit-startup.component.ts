import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
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
    industry: new FormControl<string>("", )
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
      industry: this.startupEditFormGroup.controls.industry.getRawValue()!
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
        this.startupEditFormGroup.setValue({
          fundingGoal: res.fundingGoal,
          title: res.title,
          description: res.description,
          tam: res.tam,
          sam: res.sam,
          som: res.som,
          teamExperience: res.teamExperience,
          industry: res.industry
        })
      })
    })
  }

  industryTypes: string[] = [];
}
