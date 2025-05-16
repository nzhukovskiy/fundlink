import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {FundingRoundsService} from "../../../services/funding-rounds.service";
import {NgbDate, NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";
import {ngbDateFormat} from "../../../converters/ngb-date-format";
import {FundingRound} from "../../../data/models/funding-round";
import {FormType} from "../../../constants/form-type";
import {markAllControlsAsTouched, showErrors} from "../../../utils/validate-form-utils";

@Component({
    selector: 'app-edit-funding-round',
    templateUrl: './edit-funding-round.component.html',
    styleUrls: ['./edit-funding-round.component.scss']
})
export class EditFundingRoundComponent implements OnInit {
    constructor(private readonly route: ActivatedRoute,
                private readonly fundingRoundsService: FundingRoundsService,
                private readonly router: Router) {
    }

    formType = FormType.UPDATE;
    minDate?: NgbDateStruct;
    id?: number;

    fundingRoundFormGroup = new FormGroup({
        fundingGoal: new FormControl("", {validators: [Validators.required]}),
        preMoney: new FormControl("", {validators: [Validators.required]}),
        startDate: new FormControl<NgbDateStruct | undefined>(undefined, {validators: [Validators.required]}),
        endDate: new FormControl<NgbDateStruct | undefined>(undefined, {validators: [Validators.required]})
    })

    fundingRound?: FundingRound;

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            this.id = parseInt(params.get("id")!);
            this.route.data.subscribe(({fundingRound}) => {
                if (!fundingRound) {
                    this.formType = FormType.CREATE;
                    return;
                }
                this.fundingRound = fundingRound;
                if (this.fundingRound?.investments.length) {
                    this.fundingRoundFormGroup.controls.startDate.disable()
                    this.minDate = {
                        day: (new Date(fundingRound.endDate.toLocaleString())).getDate(),
                        month: (new Date(fundingRound.endDate.toLocaleString())).getMonth() + 1,
                        year: (new Date(fundingRound.endDate.toLocaleString())).getFullYear(),
                    }
                    this.fundingRoundFormGroup.controls.fundingGoal.addValidators([Validators.min(parseInt(this.fundingRound.fundingGoal))])
                }
                this.fundingRoundFormGroup.setValue({
                    fundingGoal: fundingRound.fundingGoal,
                    preMoney: fundingRound.preMoney,
                    startDate: {
                        day: (new Date(fundingRound.startDate.toLocaleString())).getDate(),
                        month: (new Date(fundingRound.startDate.toLocaleString())).getMonth() + 1,
                        year: (new Date(fundingRound.startDate.toLocaleString())).getFullYear(),
                    },
                    endDate: {
                        day: (new Date(fundingRound.endDate)).getDate(),
                        month: (new Date(fundingRound.endDate)).getMonth() + 1,
                        year: (new Date(fundingRound.endDate)).getFullYear(),
                    }
                })
            })
        })
    }

    handleFormSubmission() {
        if (this.fundingRoundFormGroup.invalid) {
            markAllControlsAsTouched(this.fundingRoundFormGroup);
            console.log("invalid")
            return;
        }
        if (this.formType === FormType.UPDATE) {
            this.updateFundingRound();
        }
        else {
            this.createFundingRound();
        }
    }

    updateFundingRound() {
        if (!this.fundingRoundFormGroup.invalid) {
            console.log("Updating")
            this.fundingRoundsService.update(this.id!, {
                fundingGoal: this.fundingRoundFormGroup.controls.fundingGoal.getRawValue()!,
                preMoney: this.fundingRoundFormGroup.controls.preMoney.getRawValue()!,
                startDate: ngbDateFormat(this.fundingRoundFormGroup.controls.startDate.getRawValue()!),
                endDate: ngbDateFormat(this.fundingRoundFormGroup.controls.endDate.getRawValue()!),
            }).subscribe(res => {
                this.router.navigate(['/profile']).then();
            })
        }
    }

    createFundingRound() {
        console.log("creating")
        this.fundingRoundsService.create({
            fundingGoal: this.fundingRoundFormGroup.controls.fundingGoal.getRawValue()!,
            preMoney: this.fundingRoundFormGroup.controls.preMoney.getRawValue()!,
            startDate: ngbDateFormat(this.fundingRoundFormGroup.controls.startDate.getRawValue()!),
            endDate: ngbDateFormat(this.fundingRoundFormGroup.controls.endDate.getRawValue()!),
        }).subscribe(res => {
            this.router.navigate(['/profile']).then();
        })
    }

    protected readonly FormType = FormType;
    protected readonly showErrors = showErrors;
}
