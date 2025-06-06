import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ExitType } from '../../../constants/exit-type';
import { MatDialogRef } from '@angular/material/dialog';

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
        totalShares: new FormControl(''),
    })

    exitType = ExitType.ACQUIRED

    exitStartup() {
        this.dialogRef.close(this.exitFormGroup.getRawValue())
    }

    ngOnInit(): void {
        this.exitFormGroup.controls.type.setValue(ExitType.ACQUIRED);
        this.exitFormGroup.controls.type.valueChanges.subscribe(value => {
            this.exitType = value as ExitType
        })
    }

    protected readonly Object = Object;
    protected readonly ExitType = ExitType;
}
