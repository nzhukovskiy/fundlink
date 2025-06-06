import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-input-help-tooltip',
  templateUrl: './input-help-tooltip.component.html',
  styleUrls: ['./input-help-tooltip.component.scss']
})
export class InputHelpTooltipComponent {

    @Input()
    tooltipMessage?: string;
}
