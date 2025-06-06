import {Roles} from "../../constants/roles";
import {Chat} from "./chat";

export class Message {
    id: number;

    chat: Chat;

    senderType: Roles;

    senderId: number;

    text: string;

    timestamp: Date;

    readAt: Date;

    constructor(id: number, chat: Chat, senderType: Roles, senderId: number, text: string, timestamp: Date, readAt: Date) {
        this.id = id;
        this.chat = chat;
        this.senderType = senderType;
        this.senderId = senderId;
        this.text = text;
        this.timestamp = new Date(timestamp);
        this.readAt = readAt;
    }
}
