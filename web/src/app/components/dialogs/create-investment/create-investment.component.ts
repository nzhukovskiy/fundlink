import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SubmitDialogComponent } from '../../../dialogs/submit-dialog/submit-dialog.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { InvestmentsService } from '../../../services/investments.service';
import Decimal from 'decimal.js';
import { markAllControlsAsTouched } from '../../../utils/validate-form-utils';

@Component({
    selector: 'app-create-investment',
    templateUrl: './create-investment.component.html',
    styleUrls: ['./create-investment.component.scss'],
})
export class CreateInvestmentComponent {
    constructor(public dialogRef: MatDialogRef<SubmitDialogComponent>,
                private readonly investmentsService: InvestmentsService) {
    }

    readonly data = inject<number>(MAT_DIALOG_DATA);

    investmentFormGroup = new FormGroup({
        amount: new FormControl<string>('', [Validators.required, Validators.min(1)]),
    });

    close(data: Decimal) {
        this.dialogRef.close(data);
    }

    makeInvestment() {
        if (this.investmentFormGroup.invalid) {
            markAllControlsAsTouched(this.investmentFormGroup);
            return;
        }
        this.investmentsService.create(this.data,
            { amount: this.investmentFormGroup.controls.amount.getRawValue()! },
        ).subscribe(res => this.close(res.amount));
    }
}
