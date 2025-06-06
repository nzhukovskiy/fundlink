import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Investor} from 'src/app/data/models/investor';
import {Roles} from "../../../constants/roles";
import {LocalStorageService} from "../../../services/local-storage.service";
import {InvestorStatsDto} from "../../../data/dtos/responses/investor-stats.dto";

@Component({
    selector: 'app-investor-page',
    templateUrl: './investor-page.component.html',
    styleUrls: ['./investor-page.component.scss']
})
export class InvestorPageComponent implements OnInit {
    constructor(private readonly route: ActivatedRoute,
                readonly localStorageService: LocalStorageService,) {
    }

    investor?: Investor;

    investorStats?: InvestorStatsDto;

    ngOnInit(): void {
        this.route.data.subscribe(({data}) => {
            this.investor = data.investor;
            this.investorStats = data.stats;
        })

    }

    protected readonly Roles = Roles;
    protected readonly Object = Object;
}
