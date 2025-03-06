import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {tap} from "rxjs";
import {SubmitDialogReturn} from "../../constants/submit-dialog-return";

@Component({
  selector: 'app-submit-dialog',
  templateUrl: './submit-dialog.component.html',
  styleUrls: ['./submit-dialog.component.scss']
})
export class SubmitDialogComponent implements OnInit {
    constructor(public dialogRef: MatDialogRef<SubmitDialogComponent>) {
    }

    @Input() labels = {
        question: "Вы уверены?",
        accept: "Да",
        reject: "Нет"
    }

    ngOnInit(): void {
        this.dialogRef.beforeClosed().pipe(tap(x => {
            if (x == undefined) {
                return SubmitDialogReturn.REJECT;
            }
            return x;
        }));
    }

    closeWithAccept() {
        this.dialogRef.close(SubmitDialogReturn.ACCEPT);
    }

    closeWithReject() {
        this.dialogRef.close(SubmitDialogReturn.REJECT);
    }
}
