import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets"
import { Server, Socket } from "socket.io"
import { BaseGateway } from "../../../../common/gateways/base/base.gateway"
import { OnEvent } from "@nestjs/event-emitter"
import { JwtTokenService } from "../../../token/services/jwt-token.service"

@WebSocketGateway(3001, { cors: true, namespace: "/notifications" })
export class NotificationsGateway extends BaseGateway {
    constructor(jwtTokenService: JwtTokenService) {
        super(jwtTokenService)
    }
    @WebSocketServer()
    server: Server;

    @SubscribeMessage("message")
    handleMessage(client: any, payload: any): string {
        return "Hello world!"
    }

    @OnEvent('notification')
    handleNotification(payload: {
        startupId: number;
        text: string;
    }) {
        this.server.to(`startup-${payload.startupId}`).emit("notification", payload.text);
    }
}
