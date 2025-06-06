import { Component, OnInit } from '@angular/core';
import { Investor } from 'src/app/data/models/investor';
import { InvestorsService } from 'src/app/services/investors.service';

@Component({
  selector: 'app-all-investors',
  templateUrl: './all-investors.component.html',
  styleUrls: ['./all-investors.component.scss']
})
export class AllInvestorsComponent implements OnInit {
  constructor(private readonly investorsService: InvestorsService) {
  }
  ngOnInit(): void {
    this.investorsService.getAll().subscribe(res => {
      this.investors = res.data;
    })
  }
  investors: Investor[] = [];
}
