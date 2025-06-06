import { Component } from '@angular/core';
import { NotificationBase } from '../notification-base/notification-base';
import { NotificationType } from '../../../constants/notification-type';
import { InvestmentStage } from '../../../constants/investment-stage';
import { InvestmentsService } from '../../../services/investments.service';

@Component({
  selector: 'app-investment-notification',
  templateUrl: './investment-notification.component.html',
  styleUrls: ['./investment-notification.component.scss']
})
export class InvestmentNotificationComponent extends NotificationBase {

    constructor(private readonly investmentsService: InvestmentsService) {
        super();
    }

    approveInvestment() {
        this.investmentsService.approveInvestment(this.notification!.investment!.id).subscribe(investment => {
            this.notification!.investment = investment;
        })
    }

    rejectInvestment() {
        this.investmentsService.rejectInvestment(this.notification!.investment!.id).subscribe(investment => {
            this.notification!.investment = investment;
        })
    }
    protected readonly InvestmentStage = InvestmentStage;
}
