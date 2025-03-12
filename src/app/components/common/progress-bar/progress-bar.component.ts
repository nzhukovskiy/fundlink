import {Component, Input} from '@angular/core';
import Decimal from "decimal.js";

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent {

    @Input() fillPercent = 0;
    @Input() fillColor = "#000000";
}
