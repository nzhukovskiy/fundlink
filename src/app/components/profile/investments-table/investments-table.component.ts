import { Component, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { InvestmentApprovalType } from '../../../constants/investment-approval-type';
import { InvestmentStage } from '../../../constants/investment-stage';
import { Investment } from '../../../data/models/investment';
import { Roles } from '../../../constants/roles';
import { NgbdSortableHeaderDirective } from '../../../directives/ngbd-sortable-header.directive';
import { SortEvent } from '../../../types/sort-event';
import Decimal from 'decimal.js';
import {InvestmentFullDto} from "../../../data/dtos/responses/investment-full.dto";

@Component({
  selector: 'app-investments-table',
  templateUrl: './investments-table.component.html',
  styleUrls: ['./investments-table.component.scss']
})
export class InvestmentsTableComponent {

    @Input() investmentsFor?: Roles;
    @Input() investments: InvestmentFullDto[] = [];
    @Output() approveInvestmentDialogClick = new EventEmitter<number>()

    @ViewChildren(NgbdSortableHeaderDirective) headers?: QueryList<NgbdSortableHeaderDirective>;


    protected readonly InvestmentApprovalType = InvestmentApprovalType;
    protected readonly InvestmentStage = InvestmentStage;
    protected readonly Roles = Roles;

    compare = (v1: string | number | Date, v2: string | number | Date) => (v1 < v2 ? -1 : v1 > v2 ? 1 : 0);

    compareValues(v1: string | number | Date | Decimal,
                  v2: string | number | Date | Decimal): number {
        if ((v1 instanceof Decimal || v2 instanceof Decimal) && !(v1 instanceof Date) && !(v2 instanceof Date)) {
            const d1 = v1 instanceof Decimal ? v1 : new Decimal(v1);
            const d2 = v2 instanceof Decimal ? v2 : new Decimal(v2);
            return d1.comparedTo(d2);
        }

        if (v1 instanceof Date && v2 instanceof Date) {
            return v1.getTime() - v2.getTime();
        }

        if (typeof v1 === 'string' && typeof v2 === 'string') {
            return v1.localeCompare(v2);
        }

        return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
    }

    emitApproveDialogClick(investmentId: number) {
        this.approveInvestmentDialogClick.emit(investmentId);
    }

    onSort({ column, direction }: SortEvent) {
        for (const header of this.headers!) {
            if (header.sortable !== column) {
                header.direction = '';
            }
        }

        if (direction === '' || column === '') {
        } else {
            this.investments = [...this.investments].sort((a, b) => {
                const res = this.compareValues(a[column], b[column]);
                return direction === 'asc' ? res : -res;
            });
        }
    }
}
