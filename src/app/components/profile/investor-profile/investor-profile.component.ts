import {Component, inject, OnInit} from '@angular/core';
import {InvestorsService} from "../../../services/investors.service";
import {Investor} from "../../../data/models/investor";
import {Investment} from "../../../data/models/investment";
import {Startup} from "../../../data/models/startup";
import {ChartConfiguration} from "chart.js";
import {start} from "@popperjs/core";

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
    startups: Startup[] = [];
    public lineChartData?: ChartConfiguration<'pie'>['data'];

    ngOnInit(): void {
        this.investorsService.getCurrentInvestor().subscribe(res => {
            this.investor = res;
            this.investorsService.getFullInvestmentsInfo().subscribe(investments => {
                this.investments = investments;
            })
            this.investorsService.getStartups(this.investor.id).subscribe(startups => {
                this.startups = startups.entities;
                this.startups.forEach(startup => {
                    startup.totalInvestment = startups.raw.find(x => x.startup_id === startup.id).totalInvestment;
                })
                this.lineChartData = {
                    labels: this.startups.map(x => x.title),
                    datasets: [{
                        data: this.startups.map(x => parseInt(x.totalInvestment)),
                    }],
                };
            })
        })
    }


}
