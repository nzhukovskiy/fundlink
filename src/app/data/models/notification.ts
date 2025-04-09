import { Roles } from '../../constants/roles';
import { NotificationType } from '../../constants/notification-type';
import { Message } from './message';
import { Investment } from './investment';
import {FundingRoundChangeProposal} from "./funding-round-change-proposal";

export class Notification {
    id: number

    userId: number

    userType: Roles

    type: NotificationType

    text: string

    read: boolean

    createdAt: Date

    message?: Message

    investment?: Investment

    changes?: FundingRoundChangeProposal

    constructor(id: number, userId: number, userType: Roles, type: NotificationType, text: string, read: boolean, createdAt: Date, message: Message, investment: Investment, changes: FundingRoundChangeProposal) {
        this.id = id;
        this.userId = userId;
        this.userType = userType;
        this.type = type;
        this.text = text;
        this.read = read;
        this.createdAt = createdAt;
        this.message = message;
        this.investment = investment;
        this.changes = changes;
    }
}
