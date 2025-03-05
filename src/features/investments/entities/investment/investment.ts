import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Startup } from "../../../users/startups/entities/startup";
import { Investor } from "../../../users/investors/entities/investor";
import { FundingRound } from "../funding-round/funding-round";
import { InvestmentApprovalType } from "../../constants/investment-approval-type";
import { InvestmentStage } from "../../constants/investment-stage";

@Entity()
export class Investment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "decimal"})
    amount: string;

    @Column()
    date: Date;

    @Column({
        type: 'enum',
        enum: InvestmentApprovalType,
        default: InvestmentApprovalType.AUTO_APPROVE
    })
    approvalType: InvestmentApprovalType;

    @Column({ type: 'enum', enum: InvestmentStage })
    stage: InvestmentStage;

    @ManyToOne(() => Investor, (investor) => investor.investments)
    investor: Investor;

    @ManyToOne(() => FundingRound, (fundingRound) => fundingRound.investments)
    fundingRound: FundingRound;
}
