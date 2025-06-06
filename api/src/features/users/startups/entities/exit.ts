import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ExitType } from "../../constants/exit-type";
import { Startup } from "./startup.entity";

@Entity()
export class Exit {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    date: Date;

    @Column({
        type: 'enum',
        enum: ExitType,
    })
    type: ExitType;

    @Column({type: "decimal"})
    value: string;

    @OneToOne(() => Startup, startup => startup.exit)
    @JoinColumn()
    startup: Startup;

    @Column({type: "decimal", nullable: true})
    sharePrice: string;

    @Column({type: "decimal", nullable: true})
    totalShares: string;

    @Column({nullable: true, default: 180})
    lockupPeriodDays: number;
}
