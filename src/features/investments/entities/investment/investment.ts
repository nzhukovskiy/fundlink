import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Startup } from "../../../users/startups/entities/startup";
import { Investor } from "../../../users/investors/entities/investor";
import { FundingRound } from "../funding-round/funding-round";

@Entity()
export class Investment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "decimal"})
    amount: string;

    @Column()
    date: Date;

    @ManyToOne(() => Investor, (investor) => investor.investments)
    investor: Investor;

    @ManyToOne(() => FundingRound, (fundingRound) => fundingRound.investments)
    fundingRound: FundingRound;
}
