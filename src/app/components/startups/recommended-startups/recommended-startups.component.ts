import { Component, OnInit } from '@angular/core';
import { InvestorsService } from 'src/app/services/investors.service';
import {catchError} from "rxjs";

@Component({
    selector: 'app-recommended-startups',
    templateUrl: './recommended-startups.component.html',
    styleUrls: ['./recommended-startups.component.scss'],
})
export class RecommendedStartupsComponent implements OnInit {
    constructor(private readonly investorsService: InvestorsService) {
    }

    recommendedStartups: any[] = [];

    ngOnInit(): void {
        this.investorsService.getRecommendations().subscribe({
            next: (res) => {
                this.recommendedStartups = (res as any).recommendedStartups;
            },
        error: (err) => {
            this.recommendedStartups = []
        }});
    }

}
