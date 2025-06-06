import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Message } from "./entities/message/message";
import { Chat } from "./entities/chat/chat";
import { ChatsService } from './services/chats/chats.service';
import { ChatsController } from './controllers/chats/chats.controller';
import { JwtTokenModule } from "../token/jwt-token.module";
import { ChatsGateway } from './gateways/chats/chats.gateway';
import { MessagesService } from './services/messages/messages.service';

@Module({
    imports: [TypeOrmModule.forFeature([Message, Chat]),
        JwtTokenModule],
    providers: [ChatsService, ChatsGateway, MessagesService],
    controllers: [ChatsController]
})
export class ChatsModule {}
