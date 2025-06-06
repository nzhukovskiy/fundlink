import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Chat } from "../chat/chat";
import { Roles } from "../../../users/constants/roles";

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Chat, (chat) => chat.messages)
    chat: Chat;

    @Column({ type: 'enum', enum: Roles })
    senderType: Roles;

    @Column()
    senderId: number;

    @Column('text')
    text: string;

    @CreateDateColumn()
    timestamp: Date;

    @Column({ type: 'timestamp', nullable: true })
    readAt: Date | null;
}
