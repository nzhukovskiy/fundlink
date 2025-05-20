import { User } from "../../user/user";
import { Column, CreateDateColumn, Entity, Index, JoinTable, ManyToMany, OneToMany, OneToOne } from "typeorm";
import { FundingRound } from "../../../investments/entities/funding-round/funding-round";
import { Roles } from "../../constants/roles";
import { Tag } from "../../../tags/entities/tag/tag";
import { InvestmentApprovalType } from "../../../investments/constants/investment-approval-type";
import { FundingStage } from "../../../investments/constants/funding-stage";
import { StartupStage } from "../../constants/startup-stage";
import { Exit } from "./exit";

@Entity()
export class Startup extends User {
    @Column()
    @Index('idx_startup_title_gin', { synchronize: false })
    title: string;

    @Column()
    description: string;

    @Column({type: "decimal"})
    fundingGoal: string;

    @Column({nullable: true})
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

    @Column({ nullable: true })
    logoPath: string;

    @Column({ default: true })
    autoApproveInvestments: boolean;

    @CreateDateColumn()
    joinedAt: Date;

    @Column({
        type: 'enum',
        enum: StartupStage,
        default: StartupStage.ACTIVE,
    })
    stage: StartupStage;

    @OneToMany(() => FundingRound, (fundingRound) => fundingRound.startup)
    fundingRounds: FundingRound[];

    @ManyToMany(() => Tag, tag => tag.startups)
    @JoinTable()
    tags: Tag[]

    @OneToOne(() => Exit, exit => exit.startup, { cascade: true })
    exit: Exit;

    getRole(): Roles {
        return Roles.STARTUP;
    }
}
