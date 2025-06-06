import { Component, ElementRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StartupService } from '../../../services/startup.service';
import { ConstantsService } from 'src/app/services/constants.service';
import { RemoteFileService } from '../../../services/remote-file.service';
import { environment } from '../../../../environments/environment';
import { FormType } from '../../../constants/form-type';
import { AuthService } from '../../../services/auth.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { MatDialog } from '@angular/material/dialog';
import { TextDialogComponent } from '../../dialogs/text-dialog/text-dialog.component';
import {markAllControlsAsTouched, showErrors} from "../../../utils/validate-form-utils";

@Component({
    selector: 'app-edit-startup',
    templateUrl: './edit-startup.component.html',
    styleUrls: ['./edit-startup.component.scss'],
})
export class EditStartupComponent implements OnInit {

    constructor(private readonly route: ActivatedRoute,
                private readonly router: Router,
                private readonly startupService: StartupService,
                private readonly constantsService: ConstantsService,
                private readonly remoteFileService: RemoteFileService,
                private readonly authService: AuthService,
                private readonly localStorageService: LocalStorageService,
                private readonly dialog: MatDialog) {
    }

    @Input() formType = FormType.UPDATE;
    id?: number;
    @ViewChild('startupLogoInput') fileInput?: ElementRef;
    @ViewChild('startupLogoPreview') imagePreview?: ElementRef;

    startupEditFormGroup = new FormGroup({
        email: new FormControl<string>('', {validators: [Validators.required, Validators.email]}),
        password: new FormControl<string>('', {validators: [Validators.required, Validators.minLength(8)]}),
        title: new FormControl<string>('', {validators: [Validators.required]}),
        description: new FormControl<string>('', {validators: [Validators.required]}),
        logo: new FormControl<File | undefined>(undefined),
        autoApproveInvestments: new FormControl(true),
        fundingGoal: new FormControl<string>('', {validators: [Validators.required]}),
        preMoney: new FormControl<string>('', {validators: [Validators.required]}),
        initialFundingGoal: new FormControl<string>('', {validators: [Validators.required]}),
        tamMarket: new FormControl<string>('', {validators: [Validators.required]}),
        samMarket: new FormControl<string>('', {validators: [Validators.required]}),
        somMarket: new FormControl<string>('', {validators: [Validators.required]}),
        teamExperience: new FormControl<string | null>(null),
        // industry: new FormControl<string>("", ),
        revenuePerYear: new FormArray(
            Array(5).fill(null).map(() => new FormControl<number>(0, {
                nonNullable: true,
                validators: [Validators.required],
            })),
        ),
        capitalExpenditures: new FormArray(
            Array(5).fill(null).map(() => new FormControl<number>(0, {
                nonNullable: true,
                validators: [Validators.required],
            })),
        ),
        changesInWorkingCapital: new FormArray(
            Array(5).fill(null).map(() => new FormControl<number>(0, {
                nonNullable: true,
                validators: [Validators.required],
            })),
        ),
        deprecationAndAmortization: new FormArray(
            Array(5).fill(null).map(() => new FormControl<number>(0, {
                nonNullable: true,
                validators: [Validators.required],
            })),
        ),
    });

    handleFormSubmission() {
        if (this.startupEditFormGroup.invalid) {
            markAllControlsAsTouched(this.startupEditFormGroup);
            return;
        }
        if (this.formType === FormType.CREATE) {
            this.createStartup();
        } else {
            this.editStartup();
        }
    }

    editStartup() {
        this.startupService.update({
            title: this.startupEditFormGroup.controls.title.getRawValue()!,
            description: this.startupEditFormGroup.controls.description.getRawValue()!,
            fundingGoal: this.startupEditFormGroup.controls.fundingGoal.getRawValue()!,
            tamMarket: this.startupEditFormGroup.controls.tamMarket.getRawValue()!,
            samMarket: this.startupEditFormGroup.controls.samMarket.getRawValue()!,
            somMarket: this.startupEditFormGroup.controls.somMarket.getRawValue()!,
            teamExperience: this.startupEditFormGroup.controls.teamExperience.getRawValue()!,
            autoApproveInvestments: this.startupEditFormGroup.controls.autoApproveInvestments.getRawValue()!,
            revenuePerYear: this.startupEditFormGroup.controls.revenuePerYear.getRawValue()!,
            capitalExpenditures: this.startupEditFormGroup.controls.capitalExpenditures.getRawValue()!,
            changesInWorkingCapital: this.startupEditFormGroup.controls.changesInWorkingCapital.getRawValue()!,
            deprecationAndAmortization: this.startupEditFormGroup.controls.deprecationAndAmortization.getRawValue()!,
        }).subscribe(this.uploadLogo);
    }

    createStartup() {
        this.authService.registerStartup({
            title: this.startupEditFormGroup.controls.title.getRawValue()!,
            description: this.startupEditFormGroup.controls.description.getRawValue()!,
            email: this.startupEditFormGroup.controls.email.getRawValue()!,
            password: this.startupEditFormGroup.controls.password.getRawValue()!,
            fundingGoal: this.startupEditFormGroup.controls.fundingGoal.getRawValue()!,
            preMoney: this.startupEditFormGroup.controls.preMoney.getRawValue()!,
            initialFundingGoal: this.startupEditFormGroup.controls.initialFundingGoal.getRawValue()!,
            tamMarket: this.startupEditFormGroup.controls.tamMarket.getRawValue()!,
            samMarket: this.startupEditFormGroup.controls.samMarket.getRawValue()!,
            somMarket: this.startupEditFormGroup.controls.somMarket.getRawValue()!,
            teamExperience: this.startupEditFormGroup.controls.teamExperience.getRawValue()!,
            autoApproveInvestments: this.startupEditFormGroup.controls.autoApproveInvestments.getRawValue()!,
            revenuePerYear: this.startupEditFormGroup.controls.revenuePerYear.getRawValue()!,
            capitalExpenditures: this.startupEditFormGroup.controls.capitalExpenditures.getRawValue()!,
            changesInWorkingCapital: this.startupEditFormGroup.controls.changesInWorkingCapital.getRawValue()!,
            deprecationAndAmortization: this.startupEditFormGroup.controls.deprecationAndAmortization.getRawValue()!,
        }).subscribe(this.uploadLogo);
    }

    uploadLogo = () => {
        if (this.startupEditFormGroup.controls.logo.getRawValue()) {
            this.startupService.uploadStartupImage(this.startupEditFormGroup.controls.logo.getRawValue()).subscribe(startup => {
                this.router.navigate(['/profile']).then();
            });
        } else {
            this.router.navigate(['/profile']).then();
        }
    };

    ngOnInit(): void {
        if (this.formType === FormType.UPDATE) {
            let user = this.localStorageService.getUser();
            this.startupService.getOne(user!.id).subscribe(startup => {
                this.startupEditFormGroup.controls.email.clearValidators();
                this.startupEditFormGroup.controls.email.updateValueAndValidity();
                this.startupEditFormGroup.controls.password.clearValidators();
                this.startupEditFormGroup.controls.password.updateValueAndValidity();
                this.startupEditFormGroup.controls.initialFundingGoal.clearValidators();
                this.startupEditFormGroup.controls.initialFundingGoal.updateValueAndValidity();
                if (!startup.logoPath) {
                    this.startupEditFormGroup.setValue({
                        email: null,
                        password: null,
                        fundingGoal: startup.fundingGoal,
                        preMoney: null,
                        initialFundingGoal: null,
                        title: startup.title,
                        description: startup.description,
                        logo: null,
                        autoApproveInvestments: startup.autoApproveInvestments,
                        tamMarket: startup.tamMarket,
                        samMarket: startup.samMarket,
                        somMarket: startup.somMarket,
                        teamExperience: startup.teamExperience,
                        revenuePerYear: startup.revenuePerYear,
                        capitalExpenditures: startup.capitalExpenditures,
                        changesInWorkingCapital: startup.changesInWorkingCapital,
                        deprecationAndAmortization: startup.deprecationAndAmortization,
                    });
                } else {
                    this.remoteFileService.getImage(`${environment.apiUrl}uploads/logos/${startup.logoPath}`).subscribe(blobImage => {
                        let imageFullPath = startup.logoPath.split(/\\/);
                        let imageName = imageFullPath![imageFullPath!.length - 1];
                        let image = new File([blobImage], imageName, { type: blobImage.type || 'image/jpeg' });
                        this.startupEditFormGroup.setValue({
                            email: null,
                            password: null,
                            fundingGoal: startup.fundingGoal,
                            preMoney: null,
                            initialFundingGoal: null,
                            title: startup.title,
                            description: startup.description,
                            logo: image,
                            autoApproveInvestments: startup.autoApproveInvestments,
                            tamMarket: startup.tamMarket,
                            samMarket: startup.samMarket,
                            somMarket: startup.somMarket,
                            teamExperience: startup.teamExperience,
                            revenuePerYear: startup.revenuePerYear,
                            capitalExpenditures: startup.capitalExpenditures,
                            changesInWorkingCapital: startup.changesInWorkingCapital,
                            deprecationAndAmortization: startup.deprecationAndAmortization,
                        });
                        let fileList = new DataTransfer();
                        fileList.items.add(image);
                        this.fileInput!.nativeElement.files = fileList.files;
                        this.fileInput!.nativeElement.dispatchEvent(new Event('change'));
                    });
                }
            });
        }
    }

    get revenuePerYear(): FormArray {
        return this.startupEditFormGroup.get('revenuePerYear') as FormArray;
    }

    get capitalExpenditures(): FormArray {
        return this.startupEditFormGroup.get('capitalExpenditures') as FormArray;
    }

    get changesInWorkingCapital(): FormArray {
        return this.startupEditFormGroup.get('changesInWorkingCapital') as FormArray;
    }

    get deprecationAndAmortization(): FormArray {
        return this.startupEditFormGroup.get('deprecationAndAmortization') as FormArray;
    }

    onImageChanged(event: Event) {
        const file = (event.target as HTMLInputElement).files![0];
        if (file) {
            let reader = new FileReader();
            reader.addEventListener('load', () => {
                this.imagePreview!.nativeElement.src = reader.result;
            });
            reader.readAsDataURL(file);
        } else {
            this.imagePreview!.nativeElement.src = '';
        }
        this.startupEditFormGroup.patchValue({ logo: file });
    }

    removeImage() {
        let fileList = new DataTransfer();
        this.fileInput!.nativeElement.files = fileList.files;
        this.fileInput!.nativeElement.dispatchEvent(new Event('change'));
        this.startupEditFormGroup.patchValue({ logo: null });
    }

    openInfoDialog(template: TemplateRef<any>) {
        const dialogRef = this.dialog.open(TextDialogComponent, {
            data: {template},
        });
    }

    protected readonly FormType = FormType;
    protected readonly showErrors = showErrors;


    getAllErrors(formGroup: FormGroup): { [key: string]: any } {
        const errors: { [key: string]: any } = {};

        Object.keys(formGroup.controls).forEach(key => {
            const control = formGroup.get(key);

            if (control instanceof FormGroup) {
                const groupErrors = this.getAllErrors(control);
                if (Object.keys(groupErrors).length > 0) {
                    errors[key] = groupErrors;
                }
            } else if (control && control.errors) {
                errors[key] = control.errors;
            }
        });

        return errors;
    }
}
