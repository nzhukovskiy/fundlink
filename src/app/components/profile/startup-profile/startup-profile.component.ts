import {Component, OnInit} from '@angular/core';
import {Startup} from "../../../data/models/startup";
import {StartupService} from "../../../services/startup.service";
import {MatDialog} from "@angular/material/dialog";
import {SubmitDialogComponent} from "../../../dialogs/submit-dialog/submit-dialog.component";
import {filter} from "rxjs";
import {SubmitDialogReturn} from "../../../constants/submit-dialog-return";
import {FundingRoundsService} from "../../../services/funding-rounds.service";

@Component({
  selector: 'app-startup-profile',
  templateUrl: './startup-profile.component.html',
  styleUrls: ['./startup-profile.component.scss']
})
export class StartupProfileComponent implements OnInit {
  constructor(private readonly startupService: StartupService,
              private readonly fundingRoundsService: FundingRoundsService,
              public dialog: MatDialog) {
  }

  startup?: Startup;

  ngOnInit(): void {
    this.getCurrentStartup();
  }

  getCurrentStartup() {
    this.startupService.getCurrentStartup().subscribe(res => {
      this.startup = res;
    })
  }

  deleteFundingRound(id: number) {
    const dialogRef = this.dialog.open(SubmitDialogComponent);

    dialogRef.afterClosed().pipe(filter(x => x == SubmitDialogReturn.ACCEPT)).subscribe(() => {
      this.fundingRoundsService.delete(id).subscribe().add(() => this.getCurrentStartup());
    });
  }
}
