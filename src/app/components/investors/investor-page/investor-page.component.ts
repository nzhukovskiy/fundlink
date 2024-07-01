import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Investor } from 'src/app/data/models/investor';
import { InvestorsService } from 'src/app/services/investors.service';

@Component({
  selector: 'app-investor-page',
  templateUrl: './investor-page.component.html',
  styleUrls: ['./investor-page.component.scss']
})
export class InvestorPageComponent implements OnInit {
  constructor(private readonly route: ActivatedRoute,
      private readonly router: Router,
    private readonly investorsService: InvestorsService) {
  }

  investor?: Investor;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
        let id = params.get("id");
        this.investorsService.getOne(parseInt(id!)).subscribe(res => {
            this.investor = res;
        });
    })
}
}
