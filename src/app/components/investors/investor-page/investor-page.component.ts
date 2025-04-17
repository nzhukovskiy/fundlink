import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Investor} from 'src/app/data/models/investor';
import {Roles} from "../../../constants/roles";
import {LocalStorageService} from "../../../services/local-storage.service";
import {InvestorStatsDto} from "../../../data/dtos/responses/investor-stats.dto";
import {InvestorsService} from "../../../services/investors.service";
import {Z} from "@angular/cdk/keycodes";

@Component({
    selector: 'app-investor-page',
    templateUrl: './investor-page.component.html',
    styleUrls: ['./investor-page.component.scss']
})
export class InvestorPageComponent implements OnInit {
    constructor(private readonly route: ActivatedRoute,
                private readonly investorsService: InvestorsService,
                readonly localStorageService: LocalStorageService,) {
    }

    investor?: Investor;

    investorStats?: InvestorStatsDto;

    ngOnInit(): void {
        this.route.data.subscribe(({investor}) => {
            this.investor = investor;
            this.investorsService.getInvestorStats(this.investor!.id).subscribe(stats => {
                this.investorStats = stats
            })
        })

    }

    getKeys() {
        return Object.keys(this.investorStats!)
    }

    protected readonly Roles = Roles;
    protected readonly Object = Object;
}
