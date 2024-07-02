import { Component, OnInit } from '@angular/core';
import { Startup } from 'src/app/data/models/startup';
import { StartupService } from 'src/app/services/startup.service';
import {PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-all-startups',
  templateUrl: './all-startups.component.html',
  styleUrls: ['./all-startups.component.scss']
})
export class AllStartupsComponent implements OnInit {
    constructor(private readonly startupService: StartupService) {

    }

  totalBooksNumber : number = 0;
  pageSize = 8;
  pageIndex = 0;
  startups: Startup[] = [];

  ngOnInit(): void {
    this.startupService.getAll(this.pageIndex + 1, this.pageSize).subscribe(res => {
      this.startups = res.data;
      this.totalBooksNumber = res.meta.totalItems;
    })
  }

  handlePageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.startupService.getAll(event.pageIndex + 1, event.pageSize).subscribe(res => {
      this.startups = res.data;
      this.totalBooksNumber = res.meta.totalItems;
    });
  }
}
