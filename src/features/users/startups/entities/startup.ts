import { User } from "../../user/user";
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";
import { FundingRound } from "../../../investments/entities/funding-round/funding-round";
import { Roles } from "../../constants/roles";
import { Tag } from "../../../tags/entities/tag/tag";

@Entity()
export class Startup extends User {
    @Column()
    title: string;

    @Column()
    description: string;

    @Column({type: "decimal"})
    fundingGoal: string;

    @Column()
    teamExperience: number;

    @Column({type: "decimal"})
    tamMarket: string;

    @Column({type: "decimal"})
    samMarket: string;

    @Column({type: "decimal"})
    somMarket: string;

    @Column({ type: 'decimal', default: 0 })
    debtAmount: string;

    @Column({ nullable: true, type: 'json' })
    revenuePerYear?: string[];

    @Column({ nullable: true, type: 'json' })
    capitalExpenditures?: string[];

    @Column({ nullable: true, type: 'json' })
    changesInWorkingCapital?: string[];

    @Column({ nullable: true, type: 'json' })
    deprecationAndAmortization?: string[];

    @Column({ nullable: true })
    presentationPath: string;

    @OneToMany(() => FundingRound, (fundingRound) => fundingRound.startup)
    fundingRounds: FundingRound[];

    @ManyToMany(() => Tag, tag => tag.startups)
    @JoinTable()
    tags: Tag[]

    getRole(): Roles {
        return Roles.STARTUP;
    }
}
