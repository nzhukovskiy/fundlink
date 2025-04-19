import {
    Column,
    CreateDateColumn,
    Entity, JoinColumn, ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { NotificationTypes } from "../../constants/notification-types";
import { Roles } from "../../../users/constants/roles";
import { Message } from "../../../chats/entities/message/message";
import { Investor } from "../../../users/investors/entities/investor";
import { Investment } from "../../../investments/entities/investment/investment";
import {
    FundingRoundChangeProposal
} from "../../../investments/entities/funding-round-change-proposal/funding-round-change-proposal";
import { FundingRound } from "../../../investments/entities/funding-round/funding-round";
import { Exit } from "../../../users/startups/entities/exit";

@Entity()
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column({ type: "enum", enum: Roles })
    userType: Roles;

    @Column({ type: "enum", enum: NotificationTypes })
    type: NotificationTypes;

    @Column()
    text: string;

    @Column({ default: false })
    read: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => Message, { nullable: true })
    @JoinColumn()
    message?: Message;

    @ManyToOne(() => Investment, { nullable: true })
    @JoinColumn()
    investment?: Investment;

    @ManyToOne(
      () => FundingRoundChangeProposal,
        proposal => proposal.notifications,
      {
          nullable: true,
          onDelete: "CASCADE"
      })
    @JoinColumn()
    changes?: FundingRoundChangeProposal;

    @ManyToOne(() => FundingRound, { nullable: true, onDelete: "CASCADE" })
    @JoinColumn()
    fundingRound?: FundingRound;

    @ManyToOne(() => Exit, { nullable: true, onDelete: "CASCADE" })
    @JoinColumn()
    exit?: Exit;
}
