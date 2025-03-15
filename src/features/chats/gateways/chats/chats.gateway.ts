import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { JwtTokenService } from "../../../token/services/jwt-token.service";
import { CreateMessageDto } from "../../dtos/create-message-dto/create-message-dto";
import { MessagesService } from "../../services/messages/messages.service";
import { JoinChatDto } from "../../dtos/join-chat-dto/join-chat-dto";
import { ChatsService } from "../../services/chats/chats.service";
import { UseGuards } from "@nestjs/common";
import { ChatAccessGuard } from "../../guards/chat-access/chat-access.guard";
import { MarkAsReadDto } from "../../dtos/mark-as-read.dto/mark-as-read.dto";
import { Roles } from "../../../users/constants/roles";

@WebSocketGateway(3001, { cors: true })
export class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(
      private readonly jwtTokenService: JwtTokenService,
      private readonly messagesService: MessagesService,
      private readonly chatsService: ChatsService
    ) {
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
        );
        if (!Array.from(client.rooms).some(room => room === `chat-${message.chat.id}`)) {
            this.chatsService.joinChat(message.chat.id, client).then();
        }
        this.server.to(`chat-${message.chat.id}`).emit("message", message);
        let chat = await this.chatsService.getChatAndLastMessage(message.chat.id)
        if (createMessageDto.receiverId) {
            console.log("sening", `${client.data.user.role === Roles.STARTUP ? "investor": "startup"}-${createMessageDto.receiverId}`)
            this.server.to(`${client.data.user.role === Roles.STARTUP ? "investor": "startup"}-${createMessageDto.receiverId}`).emit("messageArrived", chat);
        }
        else {
            console.log(chat)
            if (client.data.user.role === Roles.STARTUP) {
                this.server.to(`investor-${chat.investor.id}`).emit("messageArrived", chat);
            }
            else {
                this.server.to(`startup-${chat.startup.id}`).emit("messageArrived", chat);
            }
        }
    }

    @UseGuards(ChatAccessGuard)
    @SubscribeMessage("joinChat")
    handleJoinChat(
      @MessageBody() joinChatDto: JoinChatDto,
      @ConnectedSocket() client: Socket
    ) {
        this.chatsService.joinChat(joinChatDto.chatId, client).then();
    }

    @UseGuards(ChatAccessGuard)
    @SubscribeMessage("markAsRead")
    async handleMarkAsRead(
      @MessageBody() markAsReadDto: MarkAsReadDto,
      @ConnectedSocket() client: Socket
    ) {
        const updatedMessage = await this.messagesService.markAsRead(markAsReadDto.messageId);
        this.server.to(`chat-${updatedMessage.chat.id}`).emit("markAsRead", updatedMessage);
    }

    async handleConnection(client: Socket) {
        console.log("Trying to connect");
        try {
            const token =
              client.handshake.auth.token ||
              client.handshake.headers.authorization?.split(" ")[1];

            if (!token) {
                throw new Error("Authentication token missing");
            }

            const tokenData = await this.jwtTokenService.verifyToken(token);

            client.data.user = tokenData.payload;
            console.log(`${client.data.user.role} ${client.data.user.id} connected via WebSocket`);
            client.join(`${client.data.user.role}-${client.data.user.id}`)
        } catch (error) {
            console.error("WebSocket Authentication Failed:", error.message);
            client.disconnect();
        }
    }

    handleDisconnect(client: any): any {
        console.log("Client disconnected:", client.id);
    }
}
