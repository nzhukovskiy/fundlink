import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { FundingRound } from "../funding-round/funding-round";
import { ChangesApprovalStatus } from "../../constants/changes-approval-status";
import { InvestorVote } from "../investor-vote/investor-vote";

@Entity()
export class FundingRoundChangeProposal {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => FundingRound)
    fundingRound: FundingRound;

    @Column({ nullable: true })
    oldFundingGoal: string;

    @Column({ nullable: true })
    oldEndDate: Date;

    @Column({ nullable: true })
    newFundingGoal: string;

    @Column({ nullable: true })
    newEndDate: Date;

    @Column({
        type: 'enum',
        enum: ChangesApprovalStatus,
        default: ChangesApprovalStatus.PENDING_REVIEW
    })
    status: ChangesApprovalStatus;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => InvestorVote, vote => vote.proposal)
    votes: InvestorVote[];
}
