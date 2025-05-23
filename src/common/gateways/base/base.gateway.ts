import { OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets"
import { Socket } from "socket.io"
import { JwtTokenService } from "../../../features/token/services/jwt-token.service"

export abstract class BaseGateway
    implements OnGatewayConnection, OnGatewayDisconnect
{
    constructor(protected readonly jwtTokenService: JwtTokenService) {}

    async handleConnection(client: Socket) {
        try {
            const token =
                client.handshake.auth.token ||
                client.handshake.headers.authorization?.split(" ")[1]

            if (!token) {
                throw new Error("Authentication token missing")
            }

            const tokenData = await this.jwtTokenService.verifyAccessToken(token)

            client.data.user = tokenData.payload
            console.log(
                `${client.data.user.role} ${client.data.user.id} connected via WebSocket`
            )
            client.join(`${client.data.user.role}-${client.data.user.id}`)
        } catch (error) {
            console.error("WebSocket Authentication Failed:", error.message)
            client.disconnect()
        }
    }

    handleDisconnect(client: any): any {
        console.log("Client disconnected:", client.id)
    }
}
