import { User } from "../../user/user";
import { Column, Entity, OneToMany } from "typeorm";
import { FundingRound } from "../../../investments/entities/funding-round/funding-round";
import { Roles } from "../../constants/roles";

@Entity()
export class Startup extends User {
    @Column()
    title: string;

    @Column()
    description: string;

    @Column({type: "decimal"})
    fundingGoal: string;

    @Column({ nullable: true })
    presentationPath: string;

    @OneToMany(() => FundingRound, (fundingRound) => fundingRound.startup)
    fundingRounds: FundingRound[];

    getRole(): Roles {
        return Roles.STARTUP;
    }
}
