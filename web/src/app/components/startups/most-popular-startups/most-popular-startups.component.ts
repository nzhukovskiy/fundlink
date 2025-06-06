import { Component, OnInit } from '@angular/core';
import { StartupService } from '../../../services/startup.service';
import {Startup} from "../../../data/models/startup";

@Component({
  selector: 'app-most-popular-startups',
  templateUrl: './most-popular-startups.component.html',
  styleUrls: ['./most-popular-startups.component.scss']
})
export class MostPopularStartupsComponent implements OnInit {

    constructor(private readonly startupService: StartupService) {
    }

    startups: Startup[] = []
    ngOnInit(): void {
        this.startupService.getMostPopular().subscribe(startups => {
            this.startups = startups;
        })
    }

}
