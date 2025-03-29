import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InvestmentApprovalType } from '../../../constants/investment-approval-type';
import { InvestmentStage } from '../../../constants/investment-stage';
import { Investment } from '../../../data/models/investment';
import { Roles } from '../../../constants/roles';

@Component({
  selector: 'app-investments-table',
  templateUrl: './investments-table.component.html',
  styleUrls: ['./investments-table.component.scss']
})
export class InvestmentsTableComponent {

    @Input() investmentsFor?: Roles;
    @Input() investments: Investment[] = [];
    @Output() approveInvestmentDialogClick = new EventEmitter<number>()

    protected readonly InvestmentApprovalType = InvestmentApprovalType;
    protected readonly InvestmentStage = InvestmentStage;
    protected readonly Roles = Roles;

    emitApproveDialogClick(investmentId: number) {
        this.approveInvestmentDialogClick.emit(investmentId);
    }
}
