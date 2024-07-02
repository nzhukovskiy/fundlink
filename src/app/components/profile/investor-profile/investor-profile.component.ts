import {Component, inject, OnInit} from '@angular/core';
import {InvestorsService} from "../../../services/investors.service";
import {Investor} from "../../../data/models/investor";

@Component({
  selector: 'app-investor-profile',
  templateUrl: './investor-profile.component.html',
  styleUrls: ['./investor-profile.component.scss']
})
export class InvestorProfileComponent implements OnInit {
  constructor(private readonly investorsService: InvestorsService) {
  }

  investor?: Investor;
  ngOnInit(): void {
    this.investorsService.getCurrentInvestor().subscribe(res => {
      this.investor = res;
    })
  }


}
