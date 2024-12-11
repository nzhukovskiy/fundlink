import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FundingRoundsService} from "../../../services/funding-rounds.service";
import {NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";
import {FormControl, FormGroup} from "@angular/forms";
import {ngbDateFormat} from "../../../converters/ngb-date-format";
import { plainToInstance } from 'class-transformer';
import { CreateFundingRoundDto } from 'src/app/data/dtos/create-funding-round.dto';

@Component({
  selector: 'app-create-funding-round',
  templateUrl: './create-funding-round.component.html',
  styleUrls: ['./create-funding-round.component.scss']
})
export class CreateFundingRoundComponent implements OnInit {
  constructor(private readonly route: ActivatedRoute,
              private readonly fundingRoundsService: FundingRoundsService,
              private readonly router: Router) {
  }

  startDate?: NgbDateStruct;
  endDate?: NgbDateStruct;
  id?: number;

  fundingRoundFormGroup = new FormGroup({
    fundingGoal: new FormControl(""),
    startDate: new FormControl(new Date()),
    endDate: new FormControl(new Date())
  })

  ngOnInit(): void {
  }

  createFundingRound() {
    this.fundingRoundsService.create(plainToInstance(CreateFundingRoundDto,{
      funding_goal: this.fundingRoundFormGroup.controls.fundingGoal.getRawValue()!,
      start_date: ngbDateFormat(this.startDate!),
      end_date: ngbDateFormat(this.endDate!),
    })).subscribe(res => {
      this.router.navigate(['/profile']).then();
    })
  }
}
