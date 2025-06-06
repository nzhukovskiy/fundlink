import { Component, OnInit } from '@angular/core';
import { InvestorsService } from '../../../services/investors.service';
import { Investor } from '../../../data/models/investor';
import { ChartConfiguration } from 'chart.js';
import { start } from '@popperjs/core';
import { InvestmentStage } from '../../../constants/investment-stage';
import Decimal from 'decimal.js';
import { StartupFullDto } from '../../../data/dtos/responses/startup-full.dto';
import { InvestmentApprovalType } from '../../../constants/investment-approval-type';
import { Roles } from '../../../constants/roles';
import { FormType } from '../../../constants/form-type';
import { InvestmentFullDto } from '../../../data/dtos/responses/investment-full.dto';

@Component({
    selector: 'app-investor-profile',
    templateUrl: './investor-profile.component.html',
    styleUrls: ['./investor-profile.component.scss']
})
export class InvestorProfileComponent implements OnInit {
    constructor(private readonly investorsService: InvestorsService) {
    }

    investor?: Investor;
    investments: InvestmentFullDto[] = [];
    startups: StartupFullDto[] = [];
    public lineChartData?: ChartConfiguration<'pie'>['data'];
    public startupsShareData: ChartConfiguration<'doughnut'>['data'][] = [];
    public startupChartOptions: ChartConfiguration<'doughnut'>['options'] = {
        responsive: true,
        plugins: {
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const chart = context.chart;
                        const dataset = context.dataset;

                        const total = dataset.data.reduce((acc, value, index) => {
                            return chart.getDataVisibility(index) ? acc + value : acc;
                        }, 0);

                        const currentValue = context.raw as number;
                        const percentage = ((currentValue / total) * 100).toFixed(1) + '%';
                        return `${context.label}: ${currentValue} (${percentage})`;
                    }
                }
            }
        }
    };

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
                        labels: ["Вы", "Остальные инвесторы", "Стартап"],
                        datasets: [{
                            data: [
                                new Decimal(startup.totalInvestment).toNumber(),
                                (new Decimal(startup.totalInvestmentsForStartup).minus(new Decimal(startup.totalInvestment))).toNumber(),
                                new Decimal(startup.preMoney).toNumber()
                            ]
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


    protected readonly Roles = Roles;
}
