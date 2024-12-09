import { Component, Input, OnInit } from '@angular/core';
import Decimal from 'decimal.js';
import { FundingRound } from 'src/app/data/models/funding-round';
import { Startup } from 'src/app/data/models/startup';
import { StartupService } from 'src/app/services/startup.service';

@Component({
  selector: 'app-single-startup',
  templateUrl: './single-startup.component.html',
  styleUrls: ['./single-startup.component.scss']
})

export class SingleStartupComponent implements OnInit {

  constructor(private readonly startupService: StartupService) {

  }
  ngOnInit(): void {
    this.startupService.getCurrentFundingRound(this.startup!.id).subscribe(res => {
      console.log(res)
      this.currentFundingRound = res;
    })
  }

  @Input()
  startup?: Startup;

  currentFundingRound?: FundingRound;

  getRemainingFunding() {
    return new Decimal(this.currentFundingRound!.fundingGoal).minus(new Decimal(this.currentFundingRound!.currentRaised));
  }
}
