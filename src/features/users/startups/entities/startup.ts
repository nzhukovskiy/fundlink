import { User } from "../../user/user";
import { Column, Entity, OneToMany } from "typeorm";
import { FundingRound } from "../../../investments/entities/funding-round/funding-round";

@Entity()
export class Startup extends User {
    @Column()
    title: string;

    @Column()
    description: string;

    @Column({type: "decimal"})
    fundingGoal: number;

    @OneToMany(() => FundingRound, (fundingRound) => fundingRound.startup)
    fundingRounds: FundingRound[];
}
