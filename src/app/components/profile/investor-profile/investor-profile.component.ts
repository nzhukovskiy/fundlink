import {Component, inject, OnInit} from '@angular/core';
import {InvestorsService} from "../../../services/investors.service";
import {Investor} from "../../../data/models/investor";
import {Investment} from "../../../data/models/investment";
import {Startup} from "../../../data/models/startup";
import {ChartConfiguration} from "chart.js";
import {start} from "@popperjs/core";
import {InvestmentStage} from "../../../constants/investment-stage";
import Decimal from "decimal.js";

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
    public startupsShareData: ChartConfiguration<'doughnut'>['data'][] = [];

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
                    startup.sharePercentage = startups.raw.find(x => x.startup_id === startup.id).sharePercentage;
                    startup.totalInvestmentsForStartup = startups.raw.find(x => x.startup_id === startup.id).totalInvestmentsForStartup;
                    this.startupsShareData.push({
                        labels: ["Вы", "Остальные"],
                        datasets: [{
                            data: [new Decimal(startup.totalInvestment).toNumber(), (new Decimal(startup.totalInvestmentsForStartup).minus(new Decimal(startup.totalInvestment))).toNumber()]
                        }]
                    })
                })
                console.log(this.startupsShareData)
                this.lineChartData = {
                    labels: this.startups.map(x => x.title),
                    datasets: [{
                        data: this.startups.map(x => parseInt(x.totalInvestment)),
                    }],
                };

            })
        })
    }


    protected readonly InvestmentStage = InvestmentStage;
    protected readonly parseInt = parseInt;
    protected readonly start = start;
}
