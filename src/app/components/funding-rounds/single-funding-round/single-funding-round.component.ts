import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Roles } from '../../../constants/roles';
import { FundingRound } from '../../../data/models/funding-round';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from '../../../services/local-storage.service';
import { CreateInvestmentComponent } from '../../dialogs/create-investment/create-investment.component';
import Decimal from 'decimal.js';

@Component({
  selector: 'app-single-funding-round',
  templateUrl: './single-funding-round.component.html',
  styleUrls: ['./single-funding-round.component.scss']
})
export class SingleFundingRoundComponent implements OnInit {
    constructor(readonly localStorageService: LocalStorageService,) {
    }

    protected readonly Roles = Roles;

    @Input()
    fundingRound?: FundingRound;

    @Output()
    newInvestment = new EventEmitter<number>();

    @Input()
    investmentAllowed = true;

    fundingPercent?: Decimal;

    openInvestmentDialog() {
        this.newInvestment.emit(this.fundingRound?.id);
    }

    getFundingPercent() {
        return new Decimal(this.fundingRound!.currentRaised).div(new Decimal(this.fundingRound!.fundingGoal)).mul(new Decimal(100));
    }

    ngOnInit(): void {
        this.fundingPercent = this.getFundingPercent();
    }

    protected readonly parseInt = parseInt;
}
