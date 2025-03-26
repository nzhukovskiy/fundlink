import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets"
import { Server, Socket } from "socket.io"
import { JwtTokenService } from "../../../token/services/jwt-token.service"
import { CreateMessageDto } from "../../dtos/create-message-dto/create-message-dto"
import { MessagesService } from "../../services/messages/messages.service"
import { JoinChatDto } from "../../dtos/join-chat-dto/join-chat-dto"
import { ChatsService } from "../../services/chats/chats.service"
import { UseGuards } from "@nestjs/common"
import { ChatAccessGuard } from "../../guards/chat-access/chat-access.guard"
import { MarkAsReadDto } from "../../dtos/mark-as-read.dto/mark-as-read.dto"
import { Roles } from "../../../users/constants/roles"
import { BaseGateway } from "../../../../common/gateways/base/base.gateway"
import { NotificationTypes } from "../../../notifications/constants/notification-types"
import { CreateNotificationDto } from "../../../notifications/entities/dtos/create-notification.dto"
import { EventEmitter2 } from "@nestjs/event-emitter"

@WebSocketGateway(3001, { cors: true, namespace: "/chats" })
export class ChatsGateway extends BaseGateway {
    @WebSocketServer()
    server: Server

    constructor(
        readonly jwtTokenService: JwtTokenService,
        private readonly messagesService: MessagesService,
        private readonly chatsService: ChatsService,
        private readonly eventEmitter: EventEmitter2
    ) {
        super(jwtTokenService)
    }

    @UseGuards(ChatAccessGuard)
    @SubscribeMessage("message")
    async handleMessage(
        @MessageBody() createMessageDto: CreateMessageDto,
        @ConnectedSocket() client: Socket
    ) {
        const message = await this.messagesService.saveMessage(
            createMessageDto,
            client.data.user.role,
            client.data.user.id
        )
        if (
            !Array.from(client.rooms).some(
                (room) => room === `chat-${message.chat.id}`
            )
        ) {
            this.chatsService.joinChat(message.chat.id, client).then()
        }
        this.server.to(`chat-${message.chat.id}`).emit("message", message)
        const chat = await this.chatsService.getChatAndLastMessage(
            message.chat.id
        )
        if (createMessageDto.receiverId) {
            this.server
                .to(
                    `${client.data.user.role === Roles.STARTUP ? "investor" : "startup"}-${createMessageDto.receiverId}`
                )
                .emit("messageArrived", chat)

            this.eventEmitter.emit("notification", {
                userId: createMessageDto.receiverId,
                userType:
                    client.data.user.role === Roles.STARTUP
                        ? Roles.INVESTOR
                        : Roles.STARTUP,
                type: NotificationTypes.MESSAGE,
                text: `Стартап ${chat.startup.title} отправил вам сообщение`,
                message: message
            } as CreateNotificationDto)
        } else {
            console.log(chat)
            if (client.data.user.role === Roles.STARTUP) {
                this.server
                    .to(`investor-${chat.investor.id}`)
                    .emit("messageArrived", chat)
                this.eventEmitter.emit("notification", {
                    userId: chat.investor.id,
                    userType: Roles.INVESTOR,
                    type: NotificationTypes.MESSAGE,
                    text: `Стартап ${chat.startup.title} отправил вам сообщение`,
                    message: message
                } as CreateNotificationDto)
            } else {
                this.server
                    .to(`startup-${chat.startup.id}`)
                    .emit("messageArrived", chat)

                this.eventEmitter.emit("notification", {
                    userId: chat.startup.id,
                    userType: Roles.STARTUP,
                    type: NotificationTypes.MESSAGE,
                    text: `Инвестор ${chat.investor.name} ${chat.investor.surname} отправил вам сообщение`,
                    message: message
                } as CreateNotificationDto)
            }
        }
    }

    @UseGuards(ChatAccessGuard)
    @SubscribeMessage("joinChat")
    handleJoinChat(
        @MessageBody() joinChatDto: JoinChatDto,
        @ConnectedSocket() client: Socket
    ) {
        this.chatsService.joinChat(joinChatDto.chatId, client).then()
    }

    @UseGuards(ChatAccessGuard)
    @SubscribeMessage("markAsRead")
    async handleMarkAsRead(
        @MessageBody() markAsReadDto: MarkAsReadDto,
        @ConnectedSocket() client: Socket
    ) {
        const updatedMessage = await this.messagesService.markAsRead(
            markAsReadDto.messageId
        )
        this.server
            .to(`chat-${updatedMessage.chat.id}`)
            .emit("markAsRead", updatedMessage)
    }
}
