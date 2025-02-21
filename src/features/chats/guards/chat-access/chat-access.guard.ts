import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"
import { Chat } from "../../entities/chat/chat"
import { Roles } from "../../../users/constants/roles"
import { ChatsService } from "../../services/chats/chats.service"
import { Socket } from "socket.io"

@Injectable()
export class ChatAccessGuard implements CanActivate {
    constructor(private readonly chatService: ChatsService) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        let chatId: number
        let user: any
        let startupId: number
        let investorId: number
        if (context.getType() === "http") {
            const request = context.switchToHttp().getRequest()
            user = request.token.payload
            chatId = request.params.id
            startupId = request.body.startupId
            investorId = request.body.investorId
        } else if (context.getType() === "ws") {
            const client = context.switchToWs().getClient() as Socket
            user = client.data.user
            chatId = context.switchToWs().getData().chatId
            const receiverId = context.switchToWs().getData().receiverId
            if (!chatId && !receiverId) {
                client.emit("error", {
                    message: "Either chatId or receiverId must be provided",
                })
                client.disconnect()
            }
        }
        let chat
        if (chatId) {
            chat = await this.chatService.getChat(chatId)
        } else {
            chat = await this.chatService.getChatBetweenUsers({
                startupId: startupId,
                investorId: investorId,
            })
        }
        if (this.ensureUserAccess(chat, user)) {
            return true
        }
        if (context.getType() === "http") {
            return false
        } else if (context.getType() === "ws") {
            const client = context.switchToWs().getClient() as Socket
            if (context.switchToWs().getData().receiverId) {
                return true
            }
            client.emit("error", {
                message: "Access denied: Invalid chat access",
            })
            client.disconnect()
        }
    }

    private ensureUserAccess(chat: Chat, user: any) {
        if (user.role === Roles.INVESTOR) {
            if (chat.investor.id !== user.id) {
                return false
            }
        } else if (user.role === Roles.STARTUP) {
            if (chat.startup.id !== user.id) {
                return false
            }
        }
        return true
    }
}
