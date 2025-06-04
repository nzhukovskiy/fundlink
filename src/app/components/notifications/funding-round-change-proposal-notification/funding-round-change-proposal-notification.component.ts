import {Component, OnInit} from '@angular/core';
import {NotificationBase} from "../notification-base/notification-base";
import {ProposalsService} from "../../../services/proposals.service";
import {ChangesApprovalStatus} from "../../../constants/changes-approval-status";
import {LocalStorageService} from "../../../services/local-storage.service";
import {UserService} from "../../../services/users/user.service";
import {Roles} from "../../../constants/roles";

@Component({
  selector: 'app-funding-round-change-proposal-notification',
  templateUrl: './funding-round-change-proposal-notification.component.html',
  styleUrls: ['./funding-round-change-proposal-notification.component.scss']
})
export class FundingRoundChangeProposalNotificationComponent extends NotificationBase implements OnInit {
    constructor(private readonly proposalsService: ProposalsService,
                readonly userService: UserService) {
        super();
    }

    currentInvestorVoted = false;

    approveProposal() {
        this.proposalsService.vote(this.notification!.changes!.id, {
            approve: true
        }).subscribe(proposal => {
            this.notification!.changes = proposal;
            this.updateCurrentInvestorVoted();
        })
    }

    rejectProposal() {
        this.proposalsService.vote(this.notification!.changes!.id, {
            approve: false
        }).subscribe(proposal => {
            this.notification!.changes = proposal;
            this.updateCurrentInvestorVoted();
        })
    }

    protected readonly ChangesApprovalStatus = ChangesApprovalStatus;

    ngOnInit(): void {
        this.updateCurrentInvestorVoted();
    }

    protected readonly Roles = Roles;

    private updateCurrentInvestorVoted() {
        this.userService.currentUser$.subscribe(u => {
            this.currentInvestorVoted = this.notification!.changes!.votes.some(x => x.investor.id === u?.id && x.approved !== null)
        })
    }
}
