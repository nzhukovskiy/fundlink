import { User } from "../../user/user";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";
import { Roles } from "../../constants/roles";
import { FundingRound } from "../../../investments/entities/funding-round/funding-round";
import { Investment } from "../../../investments/entities/investment/investment";
import { Startup } from "../../startups/entities/startup"

@Entity()
export class Investor extends User {
    @Column()
    name: string;

    @Column()
    surname: string;

    @CreateDateColumn()
    joinedAt: Date;

    @OneToMany(() => Investment, (investment) => investment.investor)
    investments: Investment[];

    @ManyToMany(() => Startup)
    @JoinTable()
    interestingStartups: Startup[]

    getRole(): Roles {
        return Roles.INVESTOR;
    }
}
