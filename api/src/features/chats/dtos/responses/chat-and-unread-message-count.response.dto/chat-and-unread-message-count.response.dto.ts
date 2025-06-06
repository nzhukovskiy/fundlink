import { Chat } from "../../../entities/chat/chat";
import { Expose } from "class-transformer";

export class ChatAndUnreadMessageCountResponseDto extends Chat {
    @Expose()
    unreadCount: number;
}
