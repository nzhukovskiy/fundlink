import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { SortColumn } from '../types/sort-column';
import { SortDirection } from '../types/sort-direction';
import { SortEvent } from '../types/sort-event';

const rotate: { [key: string]: SortDirection } = { asc: 'desc', desc: '', '': 'asc' };


@Directive({
    selector: 'th[sortable]',
    standalone: true,
    host: {
        '[class.asc]': 'direction === "asc"',
        '[class.desc]': 'direction === "desc"',
        '(click)': 'rotate()',
    },
})
export class NgbdSortableHeaderDirective {

  constructor() { }




    @Input() sortable: SortColumn = '';
    @Input() direction: SortDirection = '';
    @Output() sort = new EventEmitter<SortEvent>();

    rotate() {
        this.direction = rotate[this.direction];
        this.sort.emit({ column: this.sortable, direction: this.direction });
    }
}
