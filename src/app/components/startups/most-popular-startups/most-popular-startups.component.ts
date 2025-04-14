import { Component, OnInit } from '@angular/core';
import { StartupService } from '../../../services/startup.service';

@Component({
  selector: 'app-most-popular-startups',
  templateUrl: './most-popular-startups.component.html',
  styleUrls: ['./most-popular-startups.component.scss']
})
export class MostPopularStartupsComponent implements OnInit {

    constructor(private readonly startupService: StartupService) {
    }
    ngOnInit(): void {
    }

}
