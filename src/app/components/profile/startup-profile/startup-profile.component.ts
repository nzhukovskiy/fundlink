import {Component, OnInit, TemplateRef} from '@angular/core';
import { Startup } from '../../../data/models/startup';
import { StartupService } from '../../../services/startup.service';
import { MatDialog } from '@angular/material/dialog';
import { SubmitDialogComponent } from '../../../dialogs/submit-dialog/submit-dialog.component';
import { filter, forkJoin } from 'rxjs';
import { SubmitDialogReturn } from '../../../constants/submit-dialog-return';
import { FundingRoundsService } from '../../../services/funding-rounds.service';
import { Investor } from '../../../data/models/investor';
import { FormControl, FormGroup } from '@angular/forms';
import { TagService } from 'src/app/services/tag.service';
import { Tag } from 'src/app/data/models/tag';
import { ChartConfiguration } from 'chart.js';
import {InvestmentsService} from "../../../services/investments.service";
import { Roles } from '../../../constants/roles';
import {StartupStage} from "../../../constants/startup-stage";
import {ExitStartupComponent} from "../exit-startup/exit-startup.component";
import {TextDialogComponent} from "../../dialogs/text-dialog/text-dialog.component";
import {InvestmentFullDto} from "../../../data/dtos/responses/investment-full.dto";
import {FundingRound} from "../../../data/models/funding-round";

@Component({
    selector: 'app-startup-profile',
    templateUrl: './startup-profile.component.html',
    styleUrls: ['./startup-profile.component.scss'],
})
export class StartupProfileComponent implements OnInit {
    constructor(private readonly startupService: StartupService,
                private readonly fundingRoundsService: FundingRoundsService,
                private readonly tagService: TagService,
                private readonly investmentsService: InvestmentsService,
                public dialog: MatDialog) {
    }

    startup?: Startup;
    investors: Investor[] = [];
    allTags: Tag[] = [];
    filteredTags: Tag[] = [];

    public investorsChartData?: ChartConfiguration<'pie'>['data'];

    public investorsChartOptions: ChartConfiguration<'pie'>['options'] = {
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

    presentationFormGroup = new FormGroup({
        presentation: new FormControl<File | undefined>(undefined),
    });

    selectOptions: { identifier: string, text: string }[] = [];

    ngOnInit(): void {
        this.initializeStartupsAndTags()
    }

    initializeStartupsAndTags() {
        forkJoin({
            tags: this.tagService.getAllTags(),
            startup: this.startupService.getCurrentStartup(),
        }).subscribe(({tags, startup}) => {
            this.startup = startup;
            this.allTags = tags;
            this.filterTags();
            this.getInvestorsForStartup();
        })
    }

    filterTags() {
        this.filteredTags = this.allTags.filter(tag => !this.startup?.tags.some(x => x.id === tag.id))
    }

    getCurrentStartup() {
        this.startupService.getCurrentStartup().subscribe(res => {
            this.startup = res;
            this.getInvestorsForStartup();
        });
    }

    getInvestorsForStartup() {
        this.startupService.getInvestors(this.startup!.id).subscribe(res => {
            this.initializeChartData(res)
            this.selectOptions = this.getSelectOptions();
        });
    }

    deleteFundingRound(id: number) {
        const dialogRef = this.dialog.open(SubmitDialogComponent);

        dialogRef.afterClosed().pipe(filter(x => x == SubmitDialogReturn.ACCEPT)).subscribe(() => {
            this.fundingRoundsService.delete(id).subscribe().add(() => this.getCurrentStartup());
        });
    }

    uploadPresentation() {
        this.startupService.uploadStartupPresentation(this.presentationFormGroup.controls.presentation.getRawValue()!).subscribe(res => {
            this.getCurrentStartup();
        });
    }

    onImageChanged(event: Event) {
        const file = (event.target as HTMLInputElement).files![0];
        this.presentationFormGroup.patchValue({ presentation: file });
        this.uploadPresentation();
    }

    addTag(tagId: number) {
        this.startupService.addTag(tagId).subscribe(res => {
            this.startup = res;
            this.filterTags();
        });
    }

    removeTag(tagId: number) {
        this.startupService.removeTag(tagId).subscribe(res => {
            this.startup = res;
            this.filterTags();
        });
    }


    getSelectOptions() {
        return this.startup!.fundingRounds.map(x => {
            return {
                identifier: x.id.toString(),
                text: x.stage,
            };
        });
    }

    loadInvestmentsData(fundingRoundId: string) {
        this.startupService.getInvestors(this.startup!.id, fundingRoundId ? fundingRoundId : undefined).subscribe(res => {
            this.initializeChartData(res)
        });
    }

    openInfoDialog(template: TemplateRef<any>) {
        this.dialog.open(TextDialogComponent, {
            data: {template},
        });
    }

    private initializeChartData(data: any) {
        this.investors = data.investors;
        this.investorsChartData = {
            labels: this.investors.map(x => x.name + ' ' + x.surname),
            datasets: [{
                data: this.investors.map(x => parseInt(x.totalInvestment)),
            }],
        };
        this.investorsChartData.labels?.push("Вы")
        this.investorsChartData.datasets[0].data.push(parseInt(data.startup.preMoney))
    }
    private approveInvestment(investmentId: number) {
        this.investmentsService.approveInvestment(investmentId).subscribe(investment => {
            this.getCurrentStartup();
        })
    }

    private rejectInvestment(investmentId: number) {
        this.investmentsService.rejectInvestment(investmentId).subscribe(investment => {
            this.getCurrentStartup();
        })
    }

    openApproveInvestmentDialog(investmentId: number) {
        const dialogRef = this.dialog.open(SubmitDialogComponent);
        let instance = dialogRef.componentInstance;
        instance.labels = {
            question: "Подтвердить инвестицию?",
            accept: "Подтвердить",
            reject: "Отклонить"
        };

        dialogRef.afterClosed().subscribe((result) => {
            if (result === SubmitDialogReturn.ACCEPT) {
                this.approveInvestment(investmentId);
            }
            else if (result === SubmitDialogReturn.REJECT) {
                this.rejectInvestment(investmentId);
            }
        });
    }

    cancelFundingRoundUpdateProposal(fundingRoundId: number) {
        this.fundingRoundsService.cancelUpdateProposal(fundingRoundId).subscribe(() => {
            this.initializeStartupsAndTags();
        })
    }

    openStartupExitDialog() {
        const dialogRef = this.dialog.open(ExitStartupComponent);

        dialogRef.afterClosed().pipe(filter(x => x != undefined)).subscribe((result) => {
            this.startupService.exitStartup(result).subscribe(startup => {
                this.startup = startup;
            })
        });
    }

    getInvestments(fundingRound: FundingRound) {
        return fundingRound.investments as InvestmentFullDto[]
    }

    protected readonly Roles = Roles;
    protected readonly StartupStage = StartupStage;
}
