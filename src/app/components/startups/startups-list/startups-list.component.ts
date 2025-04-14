import { Component, Input } from '@angular/core';
import { Startup } from '../../../data/models/startup';

@Component({
  selector: 'app-startups-list',
  templateUrl: './startups-list.component.html',
  styleUrls: ['./startups-list.component.scss']
})
export class StartupsListComponent {

    @Input()
    startups: Startup[] = [];
}
