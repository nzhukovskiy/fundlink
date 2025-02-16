import { Injectable } from '@nestjs/common';
import { Repository } from "typeorm";
import { Chat } from "../../entities/chat/chat";
import { InjectRepository } from "@nestjs/typeorm";
import { Message } from "../../entities/message/message";

@Injectable()
export class ChatsService {
    constructor(@InjectRepository(Chat) private readonly chatRepository: Repository<Chat>,
                @InjectRepository(Message) private readonly messageRepository: Repository<Message>) {
    }

    async createChat(startupId: number, investorId: number) {
        let chat = await this.chatRepository.findOneBy({startup: {id: startupId}, investor: {id: investorId}});
        if (!chat) {
            chat = await this.chatRepository.create({ startup: { id: startupId }, investor: { id: investorId } });
            console.log(chat)
            await this.chatRepository.save(chat);
        }
        return chat;
    }
}
