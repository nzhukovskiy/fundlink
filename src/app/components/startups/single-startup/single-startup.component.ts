import { Component, Input } from '@angular/core';
import { Startup } from 'src/app/data/models/startup';

@Component({
  selector: 'app-single-startup',
  templateUrl: './single-startup.component.html',
  styleUrls: ['./single-startup.component.scss']
})

export class SingleStartupComponent {
  @Input()
  startup?: Startup;
}
