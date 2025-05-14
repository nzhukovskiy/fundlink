import { Component, Input } from '@angular/core';
import { DcfDetailedDto } from '../../../data/dtos/responses/dcf-calculation-details';

@Component({
  selector: 'app-dcf-visualization',
  templateUrl: './dcf-visualization.component.html',
  styleUrls: ['./dcf-visualization.component.scss']
})
export class DcfVisualizationComponent {
    @Input() dcfDetails: DcfDetailedDto | null = null;


    formatNumber(value: number | undefined | null, decimals: number = 2): string {
        if (value === undefined || value === null || isNaN(value)) {
            return 'N/A';
        }
        return value.toFixed(decimals);
    }
}
