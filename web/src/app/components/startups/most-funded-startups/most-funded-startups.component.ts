import {Component, OnInit} from '@angular/core';
import {StartupService} from "../../../services/startup.service";
import {Startup} from "../../../data/models/startup";

@Component({
  selector: 'app-most-funded-startups',
  templateUrl: './most-funded-startups.component.html',
  styleUrls: ['./most-funded-startups.component.scss']
})
export class MostFundedStartupsComponent implements OnInit {
    constructor(private readonly startupService: StartupService) {
    }

    startups: Startup[] = []
    ngOnInit(): void {
        this.startupService.getMostFunded().subscribe(startups => {
            this.startups = startups;
        })
    }

}
