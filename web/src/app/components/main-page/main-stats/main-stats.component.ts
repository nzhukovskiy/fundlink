import {Component, OnInit} from '@angular/core';
import {MainStatsDto} from "../../../data/dtos/responses/main-stats.dto";
import {StatisticsService} from "../../../services/statistics.service";

@Component({
  selector: 'app-main-stats',
  templateUrl: './main-stats.component.html',
  styleUrls: ['./main-stats.component.scss']
})
export class MainStatsComponent implements OnInit {

    stats?: MainStatsDto;

    constructor(private readonly statisticsService: StatisticsService) {
    }
    ngOnInit(): void {
        this.statisticsService.getMainStats().subscribe(stats => {
            this.stats = stats;
        })
    }

}
