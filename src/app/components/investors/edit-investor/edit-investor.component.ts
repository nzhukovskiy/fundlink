import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InvestorsService } from 'src/app/services/investors.service';
import { FormType } from '../../../constants/form-type';
import { AuthService } from '../../../services/auth.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { markAllControlsAsTouched, showErrors } from '../../../utils/validate-form-utils';

@Component({
  selector: 'app-edit-investor',
  templateUrl: './edit-investor.component.html',
  styleUrls: ['./edit-investor.component.scss']
})
export class EditInvestorComponent implements OnInit {

    constructor (private readonly investorsService: InvestorsService,
                 private readonly router: Router,
                 private readonly authService: AuthService,
                 private readonly localStorageService: LocalStorageService,) {
    }

    @Input() formType = FormType.UPDATE;

    ngOnInit (): void {
        if (this.formType === FormType.UPDATE) {
            this.investorFormGroup.controls.email.clearValidators();
            this.investorFormGroup.controls.email.updateValueAndValidity();
            this.investorFormGroup.controls.password.clearValidators();
            this.investorFormGroup.controls.password.updateValueAndValidity();
            let user = this.localStorageService.getUser();
            this.investorsService.getOne(user!.id).subscribe(res => {
                this.investorFormGroup.setValue({
                    name: res.name,
                    surname: res.surname,
                    email: "",
                    password: "",
                    title: res.title,
                    location: res.location,
                    description: res.description
                });
            });
        }
    }

    investorFormGroup = new FormGroup({
        email: new FormControl<string>("", {validators: [Validators.required, Validators.email]}),
        password: new FormControl<string>("", {validators: [Validators.required, Validators.minLength(8)]}),
        name: new FormControl<string>('', {validators: [Validators.required]}),
        surname: new FormControl<string>('', {validators: [Validators.required]}),
        title: new FormControl<string>(''),
        location: new FormControl<string>(''),
        description: new FormControl<string>(''),
    });

    handleFormSubmission() {
        if (this.investorFormGroup.invalid) {
            markAllControlsAsTouched(this.investorFormGroup);
            return;
        }
        if (this.formType === FormType.UPDATE) {
            this.updateInvestor();
        }
        else {
            this.registerInvestor();
        }
    }

    updateInvestor () {
        this.investorsService.update({
            name: this.investorFormGroup.controls.name.getRawValue()!,
            surname: this.investorFormGroup.controls.surname.getRawValue()!,
            title: this.investorFormGroup.controls.title.getRawValue()!,
            description: this.investorFormGroup.controls.description.getRawValue()!,
            location: this.investorFormGroup.controls.location.getRawValue()!,
        }).subscribe(res => {
            this.router.navigate(['/profile']).then();
        });
    }

    registerInvestor() {
        this.authService.registerInvestor({
            name: this.investorFormGroup.controls.name.getRawValue()!,
            surname: this.investorFormGroup.controls.surname.getRawValue()!,
            email: this.investorFormGroup.controls.email.getRawValue()!,
            password: this.investorFormGroup.controls.password.getRawValue()!,
            title: this.investorFormGroup.controls.title.getRawValue()!,
            description: this.investorFormGroup.controls.description.getRawValue()!,
            location: this.investorFormGroup.controls.location.getRawValue()!,
        }).subscribe(res => {
            this.router.navigate(['']).then();
        })
    }

    protected readonly FormType = FormType;
    protected readonly showErrors = showErrors;
}
