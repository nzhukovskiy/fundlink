import { Component, OnInit } from '@angular/core';
import { Startup } from 'src/app/data/models/startup';
import { StartupService } from 'src/app/services/startup.service';

@Component({
  selector: 'app-all-startups',
  templateUrl: './all-startups.component.html',
  styleUrls: ['./all-startups.component.scss']
})
export class AllStartupsComponent implements OnInit {
    constructor(private readonly startupService: StartupService) {

    }
  ngOnInit(): void {
    this.startupService.getAll().subscribe(res => {
      this.startups = res.data;
    })
  }

    startups: Startup[] = [];
}
