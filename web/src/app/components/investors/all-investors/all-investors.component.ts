import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Investor } from 'src/app/data/models/investor';
import { InvestorsService } from 'src/app/services/investors.service';

@Component({
    selector: 'app-all-investors',
    templateUrl: './all-investors.component.html',
    styleUrls: ['./all-investors.component.scss']
})
export class AllInvestorsComponent implements OnInit {
    constructor(private readonly investorsService: InvestorsService) {
    }
    ngOnInit(): void {
        this.investorsService.getAll(this.pageIndex + 1, this.pageSize).subscribe(res => {
            this.investors = res.data;
            this.totalNumber = res.meta.totalItems;
        })
    }
    totalNumber: number = 0;
    pageSize = 8;
    pageIndex = 0;
    investors: Investor[] = [];


    handlePageChange(event: PageEvent) {
        this.pageSize = event.pageSize;
        this.pageIndex = event.pageIndex;
        this.investorsService.getAll(event.pageIndex + 1, event.pageSize).subscribe(res => {
            this.investors = res.data;
            this.totalNumber = res.meta.totalItems;
        });
    }
}
