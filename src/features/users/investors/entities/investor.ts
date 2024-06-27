import { User } from "../../user/user";
import { Column, Entity, OneToMany } from "typeorm";
import { Roles } from "../../constants/roles";
import { FundingRound } from "../../../investments/entities/funding-round/funding-round";
import { Investment } from "../../../investments/entities/investment/investment";

@Entity()
export class Investor extends User {
    @Column()
    name: string;

    @Column()
    surname: string;

    @OneToMany(() => Investment, (investment) => investment.investor)
    investments: Investment[];

    getRole(): Roles {
        return Roles.INVESTOR;
    }
}
