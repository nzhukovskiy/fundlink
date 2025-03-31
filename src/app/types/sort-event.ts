import { SortColumn } from './sort-column';
import { SortDirection } from './sort-direction';

export interface SortEvent {
    column: SortColumn;
    direction: SortDirection;
}
