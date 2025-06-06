import {Component, OnInit} from '@angular/core';
import {NotificationBase} from "../notification-base/notification-base";
import Decimal from "decimal.js";

@Component({
  selector: 'app-funding-round-ended-notification',
  templateUrl: './funding-round-ended-notification.component.html',
  styleUrls: ['./funding-round-ended-notification.component.scss']
})
export class FundingRoundEndedNotificationComponent extends NotificationBase implements OnInit {

    raisedToGoalRatio = 1;

    fundingRoundStatus: "closedSuccessfully" | "closedUnderfunded" | "closedOverfunded" = "closedSuccessfully"
    ngOnInit(): void {
        this.raisedToGoalRatio = new Decimal(this.notification!.fundingRound!.currentRaised)
            .div(new Decimal(this.notification!.fundingRound!.fundingGoal))
            .mul(100)
            .toNumber()
        const cmpResult = new Decimal(this.notification!.fundingRound!.currentRaised).cmp(new Decimal(this.notification!.fundingRound!.fundingGoal))
        switch (cmpResult) {
            case -1: {
                this.fundingRoundStatus = "closedUnderfunded"
                break
            }
            case 0: {
                this.fundingRoundStatus = "closedSuccessfully"
                break
            }
            case 1: {
                this.fundingRoundStatus = "closedOverfunded"
                break
            }
        }
    }

}
