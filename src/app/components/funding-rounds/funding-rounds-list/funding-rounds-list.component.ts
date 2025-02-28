import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FundingRound } from '../../../data/models/funding-round';

@Component({
  selector: 'app-funding-rounds-list',
  templateUrl: './funding-rounds-list.component.html',
  styleUrls: ['./funding-rounds-list.component.scss']
})
export class FundingRoundsListComponent {

    @Input()
    fundingRounds: FundingRound[] = [];

    @Output()
    newInvestment = new EventEmitter<number>();

    openInvestmentDialog(fundingRoundId: number) {
        this.newInvestment.emit(fundingRoundId);
    }
}
