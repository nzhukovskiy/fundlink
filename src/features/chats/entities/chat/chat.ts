import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Startup } from "../../../users/startups/entities/startup";
import { Investor } from "../../../users/investors/entities/investor";
import { Message } from "../message/message";

@Entity()
export class Chat {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Startup, { eager: true })
    startup: Startup;

    @ManyToOne(() => Investor, { eager: true })
    investor: Investor;

    @OneToMany(() => Message, (message) => message.chat)
    messages: Message[];
}
