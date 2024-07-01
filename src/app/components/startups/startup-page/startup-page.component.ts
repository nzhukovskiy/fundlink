import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Investor } from 'src/app/data/models/investor';
import { Startup } from 'src/app/data/models/startup';
import { StartupService } from 'src/app/services/startup.service';

@Component({
  selector: 'app-startup-page',
  templateUrl: './startup-page.component.html',
  styleUrls: ['./startup-page.component.scss']
})
export class StartupPageComponent {
  constructor(private readonly route: ActivatedRoute,
    private readonly startupService: StartupService) {
  }

  startup?: Startup;
  investors: Investor[] = [];

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
        let id = params.get("id");
        this.startupService.getOne(parseInt(id!)).subscribe(res => {
            this.startup = res;
        });
        this.startupService.getInvestors(parseInt(id!)).subscribe(res => {
          this.investors = res;
        })
    })
  }
}
