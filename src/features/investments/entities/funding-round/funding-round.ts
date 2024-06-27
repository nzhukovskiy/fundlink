import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { FundingStage } from "../../constants/funding-stage";
import { Startup } from "../../../users/startups/entities/startup";
import { Investment } from "../investment/investment";

@Entity()
export class FundingRound {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'enum',
        enum: FundingStage,
        default: FundingStage.SEED,
    })
    stage: FundingStage;

    @Column({type: "decimal"})
    fundingGoal: string;

    @Column({ default: 0, type: "decimal" })
    currentRaised: string;

    @Column()
    startDate: Date;

    @Column()
    endDate: Date;

    @Column({ default: false })
    isCurrent: boolean;

    @ManyToOne(() => Startup, (startup) => startup.fundingRounds)
    startup: Startup;

    @OneToMany(() => Investment, (investment) => investment.fundingRound)
    investments: Investment[];
}
