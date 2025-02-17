import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets"
import { Server, Socket } from "socket.io"
import { JwtTokenService } from "../../../token/services/jwt-token.service"
import { CreateMessageDto } from "../../dtos/create-message-dto/create-message-dto"
import { MessagesService } from "../../services/messages/messages.service"
import { JoinChatDto } from "../../dtos/join-chat-dto/join-chat-dto"

@WebSocketGateway(3001)
export class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server

    constructor(
        private readonly jwtTokenService: JwtTokenService,
        private readonly messagesService: MessagesService
    ) {}

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
        console.log(message, `chat-${createMessageDto.chatId}`);
        this.server.to(`chat-${createMessageDto.chatId}`).emit("message", createMessageDto.text)
    }

    @SubscribeMessage("joinChat")
    handleJoinChat(
        @MessageBody() joinChatDto: JoinChatDto,
        @ConnectedSocket() client: Socket
    ) {
        console.log("Joined chat ", joinChatDto.chatId)
        client.join(`chat-${joinChatDto.chatId}`)
    }

    async handleConnection(client: Socket) {
        try {
            const token =
                client.handshake.auth.token ||
                client.handshake.headers.authorization?.split(" ")[1]

            if (!token) {
                throw new Error("Authentication token missing")
            }

            const tokenData = await this.jwtTokenService.verifyToken(token)

            client.data.user = tokenData.payload
            console.log(`User ${client.data.user.id} connected via WebSocket`)
        } catch (error) {
            console.error("WebSocket Authentication Failed:", error.message)
            client.disconnect()
        }
    }

    handleDisconnect(client: any): any {
        console.log("Client disconnected:", client.id)
    }
}
