import {Chat} from "../../models/chat";
import {Startup} from "../../models/startup";
import {Investor} from "../../models/investor";
import {Message} from "../../models/message";

export class ChatWithUnreadCountDto extends Chat {
    unreadCount: number;

    constructor(id: number, startup: Startup, investor: Investor, messages: Message[], unreadCount: number) {
        super(id, startup, investor, messages);
        this.unreadCount = unreadCount;
    }
}
