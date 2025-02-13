import { Component, OnInit } from '@angular/core';
import { Startup } from 'src/app/data/models/startup';
import { StartupService } from 'src/app/services/startup.service';
import {PageEvent} from "@angular/material/paginator";
import { InvestorsService } from 'src/app/services/investors.service';
import { plainToInstance } from 'class-transformer';
import {FormControl} from "@angular/forms";
import {debounceTime, distinctUntilChanged} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {Tag} from "../../../data/models/tag";
import {TagService} from "../../../services/tag.service";

@Component({
  selector: 'app-all-startups',
  templateUrl: './all-startups.component.html',
  styleUrls: ['./all-startups.component.scss']
})
export class AllStartupsComponent implements OnInit {
    constructor(private readonly startupService: StartupService,
                private readonly tagService: TagService,
                private readonly router: Router,
                private readonly route: ActivatedRoute) {

    }

  totalStartupsNumber : number = 0;
  pageSize = 8;
  pageIndex = 0;
  startups: Startup[] = [];
  tag?: string;
  allTags: Tag[] = [];

  startupTitleSearch = new FormControl("");
  startupTagSearch = new FormControl("");

  ngOnInit(): void {

    this.tagService.getAllTags().subscribe(tags => {
      this.allTags = tags;
    })
    this.route.queryParams.subscribe(params => {
      this.startupTitleSearch.setValue(params["title"], { emitEvent: false });
      this.tag = params["tag"];
      if (this.tag) {
        this.startupTagSearch.setValue(this.tag);
      }
      this.startupService.getAll(this.pageIndex + 1, this.pageSize, params["title"], params["tag"]).subscribe(res => {
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
    this.startupTagSearch.valueChanges.subscribe(selectedTag => {
      this.router.navigate([], {
        queryParams: {
          tag: selectedTag || null
        },
        queryParamsHandling: 'merge'
      }).then();
    });
  }

  handlePageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.startupService.getAll(event.pageIndex + 1, event.pageSize, this.startupTitleSearch.getRawValue()!, this.tag).subscribe(res => {
      this.startups = res.data;
      this.totalStartupsNumber = res.meta.totalItems;
    });
  }

  clearTagSelection() {
    this.startupTagSearch.setValue("");
  }
}
