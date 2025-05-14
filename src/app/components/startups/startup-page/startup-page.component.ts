import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Investor} from 'src/app/data/models/investor';
import {Startup} from 'src/app/data/models/startup';
import {StartupService} from 'src/app/services/startup.service';
import {LocalStorageService} from '../../../services/local-storage.service';
import {MatDialog} from '@angular/material/dialog';
import {CreateInvestmentComponent} from '../../dialogs/create-investment/create-investment.component';
import {Roles} from '../../../constants/roles';
import {ChatService} from '../../../services/chat.service';
import {Chat} from '../../../data/models/chat';
import {BehaviorSubject} from 'rxjs';
import Decimal from 'decimal.js';
import {ChartConfiguration, ChartOptions} from "chart.js";
import { SubmitDialogComponent } from '../../../dialogs/submit-dialog/submit-dialog.component';
import { FinancialStatsComponent } from '../financial-stats/financial-stats.component';
import {ExitType} from "../../../constants/exit-type";

@Component({
    selector: 'app-startup-page',
    templateUrl: './startup-page.component.html',
    styleUrls: ['./startup-page.component.scss'],
})
export class StartupPageComponent implements OnInit {
    constructor(private readonly route: ActivatedRoute,
                private readonly startupService: StartupService,
                readonly localStorageService: LocalStorageService,
                private readonly dialog: MatDialog) {
    }

    startup?: Startup;
    investors?: Investor[];
    chat?: Chat;

    startupLoaded = new BehaviorSubject(false);

    chartData?: ChartConfiguration<'bubble'>['data'];

    chartOptions?: ChartOptions;

    ngOnInit(): void {
        this.route.data.subscribe(({startup}) => {
            this.startup = startup;
            this.startup!.fundingRounds = this.startup!.fundingRounds.sort((a, b) => a.id - b.id);
            const SCALING_FACTOR = 1
            const tamValue = parseInt(this.startup!.tamMarket);
            const samValue = parseInt(this.startup!.samMarket);
            const somValue = parseInt(this.startup!.somMarket);
            const largestRadius = Math.sqrt(Math.max(tamValue, samValue, somValue)) * SCALING_FACTOR;
            const margin = 5;

            this.chartOptions = {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        display: false,
                        grid: {display: false},
                        ticks: {display: false},
                        min: -largestRadius - margin,
                        max: largestRadius + margin
                    },
                    y: {
                        display: false,
                        grid: {display: false},
                        ticks: {display: false},
                        min: -largestRadius - margin,
                        max: largestRadius + margin
                    }
                },
                plugins: {
                    legend: {display: true, position: "top"},
                },
                layout: {
                    padding: 0
                },

            };
            this.chartData = {
                datasets: [
                    {
                        label: 'TAM',
                        data: [{x: 0, y: 0, r: Math.sqrt(parseInt(this.startup!.tamMarket)) * SCALING_FACTOR}],
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                    },
                    {
                        label: 'SAM',
                        data: [{x: 0, y: 0, r: Math.sqrt(parseInt(this.startup!.samMarket)) * SCALING_FACTOR}],
                        backgroundColor: 'rgba(8,125,199,0.2)',
                        borderColor: 'rgb(15,116,187)',
                    },
                    {
                        label: 'SOM',
                        data: [{x: 0, y: 0, r: Math.sqrt(parseInt(this.startup!.somMarket)) * SCALING_FACTOR}],
                        backgroundColor: 'rgb(147,255,66)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                    }
                ]
            }

            this.startupService.getInvestors(this.startup!.id).subscribe(res => {
                this.investors = res;
            });
        });
    }

    loadStartupAndInvestors() {
        this.route.paramMap.subscribe(params => {
            let id = params.get('id');
            this.startupService.getOne(parseInt(id!)).subscribe(res => {
                this.startup = res;
                this.startup.fundingRounds = this.startup.fundingRounds.sort((a, b) => a.id - b.id);
                this.startupLoaded.next(true);
            }).add(() => {
            });
            this.startupService.getInvestors(parseInt(id!)).subscribe(res => {
                this.investors = res;
            });
        });
    }

    openInvestmentDialog(fundingRoundId: number) {
        console.log(this.investors);
        const dialogRef = this.dialog.open(CreateInvestmentComponent, {
            data: fundingRoundId,
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result !== undefined) {
                this.loadStartupAndInvestors();
            }
        });
    }

    getTotalFundingGoalByRounds() {
        return this.startup!.fundingRounds.reduce((acc, x) => acc.add(x.fundingGoal), new Decimal(0));
    }

    getCurrentFundingByRounds() {
        return this.startup!.fundingRounds.reduce((acc, x) => acc.add(x.currentRaised), new Decimal(0));
    }

    getOverallFundingProgress() {
        return this.getCurrentFundingByRounds().div(this.getTotalFundingGoalByRounds()).mul(100);
    }

    toggleStartupInterestingState() {
        if (this.startup?.isInteresting) {
            this.startupService.removeStartupFromInteresting(this.startup!.id).subscribe(res => {
                this.loadStartupAndInvestors();
            })
        }
        else {
            this.startupService.markStartupAsInteresting(this.startup!.id).subscribe(res => {
                this.loadStartupAndInvestors();
            })
        }
    }

    openDetailedFinancialStats() {
        const dialogRef = this.dialog.open(FinancialStatsComponent, {
            data: this.startup,
        });
    }

    protected readonly Roles = Roles;
    protected readonly ExitType = ExitType;
}
