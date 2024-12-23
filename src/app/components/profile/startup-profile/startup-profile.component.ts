import {Component, OnInit} from '@angular/core';
import {Startup} from "../../../data/models/startup";
import {StartupService} from "../../../services/startup.service";
import {MatDialog} from "@angular/material/dialog";
import {SubmitDialogComponent} from "../../../dialogs/submit-dialog/submit-dialog.component";
import {filter} from "rxjs";
import {SubmitDialogReturn} from "../../../constants/submit-dialog-return";
import {FundingRoundsService} from "../../../services/funding-rounds.service";
import {Investor} from "../../../data/models/investor";
import {FormControl, FormGroup} from "@angular/forms";
import { TagService } from 'src/app/services/tag.service';
import { Tag } from 'src/app/data/models/tag';

@Component({
  selector: 'app-startup-profile',
  templateUrl: './startup-profile.component.html',
  styleUrls: ['./startup-profile.component.scss']
})
export class StartupProfileComponent implements OnInit {
  constructor(private readonly startupService: StartupService,
              private readonly fundingRoundsService: FundingRoundsService,
              private readonly tagService: TagService,
              public dialog: MatDialog) {
  }

  startup?: Startup;
  investors: Investor[] = [];
  tags: Tag[] = [];

  presentationFormGroup = new FormGroup({
    presentation: new FormControl<File|undefined>(undefined)
  })

  ngOnInit(): void {
    this.getCurrentStartup();
    this.tagService.getAllTags().subscribe( res => this.tags = res);
  }

  getCurrentStartup() {
    this.startupService.getCurrentStartup().subscribe(res => {
      this.startup = res;
      this.startupService.getInvestors(res.id).subscribe(res => {
        console.log(res)
        this.investors = res;
      })
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
    })
  }

  onImageChanged(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    this.presentationFormGroup.patchValue({ presentation: file});
    this.uploadPresentation();
  }

  addTag(tagId: number) {
    this.startupService.addTag(tagId).subscribe(res => this.startup = res);
  }

  removeTag(tagId: number) {
    this.startupService.removeTag(tagId).subscribe(res => this.startup = res);
  }
}
