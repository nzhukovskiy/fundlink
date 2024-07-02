import {Component, inject, OnInit} from '@angular/core';
import {InvestorsService} from "../../../services/investors.service";
import {Investor} from "../../../data/models/investor";
import {Investment} from "../../../data/models/investment";

@Component({
  selector: 'app-investor-profile',
  templateUrl: './investor-profile.component.html',
  styleUrls: ['./investor-profile.component.scss']
})
export class InvestorProfileComponent implements OnInit {
  constructor(private readonly investorsService: InvestorsService) {
  }

  investor?: Investor;
  investments: Investment[] = [];
  ngOnInit(): void {
    this.investorsService.getCurrentInvestor().subscribe(res => {
      this.investor = res;
      this.investorsService.getFullInvestmentsInfo().subscribe(investments => {
        this.investments = investments;
      })
    })
  }


}
