import { Component, OnInit } from '@angular/core';
import { Startup } from 'src/app/data/models/startup';
import { StartupService } from 'src/app/services/startup.service';
import {PageEvent} from "@angular/material/paginator";
import { InvestorsService } from 'src/app/services/investors.service';
import { plainToInstance } from 'class-transformer';
import {FormControl} from "@angular/forms";
import {debounceTime, distinctUntilChanged} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-all-startups',
  templateUrl: './all-startups.component.html',
  styleUrls: ['./all-startups.component.scss']
})
export class AllStartupsComponent implements OnInit {
    constructor(private readonly startupService: StartupService,
                private readonly router: Router,
                private readonly route: ActivatedRoute) {

    }

  totalStartupsNumber : number = 0;
  pageSize = 8;
  pageIndex = 0;
  startups: Startup[] = [];

  startupTitleSearch = new FormControl("");

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      this.startupTitleSearch.setValue(params["title"], { emitEvent: false });
      this.startupService.getAll(this.pageIndex + 1, this.pageSize, params["title"]).subscribe(res => {
        this.startups = res.data;
        this.totalStartupsNumber = res.meta.totalItems;
      })
    })
    this.startupTitleSearch.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(searchPattern => {
        this.router.navigate([], {
          queryParams: {
            title: searchPattern || null
          },
          queryParamsHandling: 'merge'
         }).then();
      });
  }

  handlePageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.startupService.getAll(event.pageIndex + 1, event.pageSize, this.startupTitleSearch.getRawValue()!).subscribe(res => {
      this.startups = res.data;
      this.totalStartupsNumber = res.meta.totalItems;
    });
  }
}
