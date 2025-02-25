import {Component, Input, OnInit} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InvestorsService } from 'src/app/services/investors.service';
import {FormType} from "../../../constants/form-type";
import { AuthService } from '../../../services/auth.service';
import { ChatService } from '../../../services/chat.service';
import { LocalStorageService } from '../../../services/local-storage.service';

@Component({
  selector: 'app-edit-investor',
  templateUrl: './edit-investor.component.html',
  styleUrls: ['./edit-investor.component.scss']
})
export class EditInvestorComponent implements OnInit {

    constructor (private readonly investorsService: InvestorsService,
                 private readonly router: Router,
                 private readonly route: ActivatedRoute,
                 private readonly authService: AuthService,
                 private readonly localStorageService: LocalStorageService,) {
    }

    @Input() formType = FormType.UPDATE;

    ngOnInit (): void {
        if (this.formType === FormType.UPDATE) {
            let user = this.localStorageService.getUser();
            this.investorsService.getOne(user!.payload!.id).subscribe(res => {
                this.investorFormGroup.setValue({
                    name: res.name,
                    surname: res.surname,
                    email: "",
                    password: ""
                });
            });
        }
    }

    investorFormGroup = new FormGroup({
        email: new FormControl<string>("", ),
        password: new FormControl<string>("", ),
        name: new FormControl<string>(''),
        surname: new FormControl<string>(''),
    });

    handleFormSubmission() {
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
        }).subscribe(res => {
            this.router.navigate(['']).then();
        })
    }

    protected readonly FormType = FormType;
}
