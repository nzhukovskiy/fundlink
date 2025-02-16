import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from "@nestjs/websockets";
import { Server } from 'socket.io';

@WebSocketGateway(3001)
export class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect{
    @WebSocketServer()
    server: Server;

    @SubscribeMessage('message')
    handleMessage(client: any, payload: any) {
        console.log('Received message:', payload);
        client.emit('response', 'Message received!');
    }

    handleConnection(client: any, ...args: any[]): any {
        console.log('Client connected:', client.id);
    }

    handleDisconnect(client: any): any {
        console.log('Client disconnected:', client.id);
    }
}
