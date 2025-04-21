import {Component, inject, OnInit} from '@angular/core';
import {InvestorsService} from "../../../services/investors.service";
import {Investor} from "../../../data/models/investor";
import {Investment} from "../../../data/models/investment";
import {Startup} from "../../../data/models/startup";
import {ChartConfiguration} from "chart.js";
import {start} from "@popperjs/core";
import {InvestmentStage} from "../../../constants/investment-stage";
import Decimal from "decimal.js";
import {StartupFullDto} from "../../../data/dtos/responses/startup-full.dto";
import { InvestmentApprovalType } from '../../../constants/investment-approval-type';
import { Roles } from '../../../constants/roles';
import {FormType} from "../../../constants/form-type";

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
    startups: StartupFullDto[] = [];
    public lineChartData?: ChartConfiguration<'pie'>['data'];
    public startupsShareData: ChartConfiguration<'doughnut'>['data'][] = [];

    ngOnInit(): void {
        this.investorsService.getCurrentInvestor().subscribe(res => {
            this.investor = res;
            this.investorsService.getFullInvestmentsInfo().subscribe(investments => {
                this.investments = investments;
            })
            this.investorsService.getStartups(this.investor.id).subscribe(startups => {
                this.startups = startups;
                this.startups.forEach(startup => {
                    this.startupsShareData.push({
                        labels: ["Вы", "Остальные"],
                        datasets: [{
                            data: [new Decimal(startup.totalInvestment).toNumber(), (new Decimal(startup.totalInvestmentsForStartup).minus(new Decimal(startup.totalInvestment))).toNumber()]
                        }]
                    })
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


    protected readonly InvestmentStage = InvestmentStage;
    protected readonly parseInt = parseInt;
    protected readonly start = start;
    protected readonly InvestmentApprovalType = InvestmentApprovalType;
    protected readonly Roles = Roles;
    protected readonly FormType = FormType;
}
