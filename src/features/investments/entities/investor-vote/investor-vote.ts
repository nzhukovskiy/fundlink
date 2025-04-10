import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Investor } from "../../../users/investors/entities/investor";
import { FundingRoundChangeProposal } from "../funding-round-change-proposal/funding-round-change-proposal";

@Entity()
export class InvestorVote {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Investor)
    investor: Investor;

    @ManyToOne(() => FundingRoundChangeProposal,
        proposal => proposal.votes,
      {onDelete: "CASCADE"}
      )
    proposal: FundingRoundChangeProposal;

    @Column({ nullable: true })
    approved: boolean;
}
