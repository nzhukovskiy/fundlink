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
                private readonly localStorageService: LocalStorageService,
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
            // const idx = this.notification!.changes!.votes.findIndex(x => x.id === vote.id)
            // if (idx !== -1) {
            //     this.notification!.changes!.votes[idx] = vote;
            //     this.updateCurrentInvestorVoted();
            // }
        })
    }

    rejectProposal() {
        this.proposalsService.vote(this.notification!.changes!.id, {
            approve: false
        }).subscribe(proposal => {
            this.notification!.changes = proposal;
            this.updateCurrentInvestorVoted();
            // const idx = this.notification!.changes!.votes.findIndex(x => x.id === vote.id)
            // if (idx !== -1) {
            //     this.notification!.changes!.votes[idx] = vote;
            //     this.updateCurrentInvestorVoted();
            // }
        })
    }

    protected readonly ChangesApprovalStatus = ChangesApprovalStatus;

    ngOnInit(): void {
        this.updateCurrentInvestorVoted();
    }

    protected readonly Roles = Roles;

    private updateCurrentInvestorVoted() {
        console.log("hi")
        this.userService.currentUser$.subscribe(u => {
            console.log(this.notification)
            this.currentInvestorVoted = this.notification!.changes!.votes.some(x => x.investor.id === u?.id && x.approved !== null)
            console.log(this.currentInvestorVoted)
        })
    }
}
