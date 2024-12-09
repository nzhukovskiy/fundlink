import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Investor } from 'src/app/data/models/investor';
import { Startup } from 'src/app/data/models/startup';
import { StartupService } from 'src/app/services/startup.service';
import {LocalStorageService} from "../../../services/local-storage.service";
import {MatDialog} from "@angular/material/dialog";
import {CreateInvestmentComponent} from "../../dialogs/create-investment/create-investment.component";
import {Roles} from "../../../constants/roles";

@Component({
  selector: 'app-startup-page',
  templateUrl: './startup-page.component.html',
  styleUrls: ['./startup-page.component.scss']
})
export class StartupPageComponent {
  constructor(private readonly route: ActivatedRoute,
              private readonly startupService: StartupService,
              readonly localStorageService: LocalStorageService,
              private readonly dialog: MatDialog) {
  }

  startup?: Startup;
  investors?: Investor[];

  ngOnInit(): void {
    this.loadStartupAndInvestors();
  }

  loadStartupAndInvestors() {
    this.route.paramMap.subscribe(params => {
      let id = params.get("id");
      this.startupService.getOne(parseInt(id!)).subscribe(res => {
        this.startup = res;
        this.startup.fundingRounds = this.startup.fundingRounds.sort((a,b) => a.id - b.id)
      });
      this.startupService.getInvestors(parseInt(id!)).subscribe(res => {
        this.investors = res;
      })
    })
  }

  openInvestmentDialog(fundingRoundId: number) {
    console.log(this.investors);
    const dialogRef = this.dialog.open(CreateInvestmentComponent, {
      data: fundingRoundId,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.loadStartupAndInvestors();
      }
    });
  }

  protected readonly Roles = Roles;
}
