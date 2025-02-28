import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {InvestorsService} from "../../../services/investors.service";
import {FundingRoundsService} from "../../../services/funding-rounds.service";
import {NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";
import {ngbDateFormat} from "../../../converters/ngb-date-format";
import { plainToInstance } from 'class-transformer';
import { CreateFundingRoundDto } from 'src/app/data/dtos/create-funding-round.dto';

@Component({
  selector: 'app-edit-funding-round',
  templateUrl: './edit-funding-round.component.html',
  styleUrls: ['./edit-funding-round.component.scss']
})
export class EditFundingRoundComponent implements OnInit {
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
    this.route.paramMap.subscribe(params => {
      this.id = parseInt(params.get("id")!);
      this.route.data.subscribe(({fundingRound}) => {
        this.fundingRoundFormGroup.setValue({
          fundingGoal: fundingRound.fundingGoal,
          startDate: fundingRound.startDate,
          endDate: fundingRound.endDate
        })
        this.startDate = {
          day:  (new Date(fundingRound.startDate.toLocaleString())).getDate(),
          month: (new Date(fundingRound.startDate.toLocaleString())).getMonth() + 1,
          year: (new Date(fundingRound.startDate.toLocaleString())).getFullYear(),
        }
        this.endDate = {
          day:  (new Date(fundingRound.endDate)).getDate(),
          month: (new Date(fundingRound.endDate)).getMonth() + 1,
          year: (new Date(fundingRound.endDate)).getFullYear(),
        }
      })
    })
  }

  updateFundingRound() {
    this.fundingRoundsService.update(this.id!, {
      fundingGoal: this.fundingRoundFormGroup.controls.fundingGoal.getRawValue()!,
      startDate: ngbDateFormat(this.startDate!),
      endDate: ngbDateFormat(this.endDate!),
    }).subscribe(res => {
      this.router.navigate(['/profile']).then();
    })
  }
}
