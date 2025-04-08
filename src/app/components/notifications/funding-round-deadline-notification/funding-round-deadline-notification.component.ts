import { Component } from '@angular/core';
import {NotificationBase} from "../notification-base/notification-base";
import {InvestmentsService} from "../../../services/investments.service";

@Component({
  selector: 'app-funding-round-deadline-notification',
  templateUrl: './funding-round-deadline-notification.component.html',
  styleUrls: ['./funding-round-deadline-notification.component.scss']
})
export class FundingRoundDeadlineNotificationComponent extends NotificationBase {

    constructor() {
        super();
    }
}
