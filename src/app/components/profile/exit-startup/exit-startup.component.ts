import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {ExitType} from "../../../constants/exit-type";
import {MatDialogRef} from "@angular/material/dialog";
import {SubmitDialogComponent} from "../../../dialogs/submit-dialog/submit-dialog.component";

@Component({
  selector: 'app-exit-startup',
  templateUrl: './exit-startup.component.html',
  styleUrls: ['./exit-startup.component.scss']
})
export class ExitStartupComponent implements OnInit {

    constructor(public dialogRef: MatDialogRef<ExitStartupComponent>,) {
    }


    exitFormGroup = new FormGroup({
        type: new FormControl(''),
        value: new FormControl(''),
    })
    selectOptions: { identifier: string, text: string }[] = [];
    onTypeChanged(data: any) {

    }

    exitStartup() {
        this.dialogRef.close(this.exitFormGroup.getRawValue())
    }

    ngOnInit(): void {
        this.exitFormGroup.controls.type.setValue(ExitType.ACQUIRED);
    }

    protected readonly Object = Object;
    protected readonly ExitType = ExitType;
}
