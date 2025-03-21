import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from "typeorm"
import { NotificationTypes } from "../../constants/notification-types"
import { Roles } from "../../../users/constants/roles"

@Entity()
export class Notification {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    userId: number

    @Column({ type: "enum", enum: Roles })
    userType: Roles

    @Column({ type: "enum", enum: NotificationTypes })
    type: NotificationTypes

    @Column()
    message: string

    @Column({ default: false })
    read: boolean

    @CreateDateColumn()
    createdAt: Date
}
