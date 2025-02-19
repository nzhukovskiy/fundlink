import { Injectable } from "@nestjs/common"
import { Repository } from "typeorm"
import { Chat } from "../../entities/chat/chat"
import { InjectRepository } from "@nestjs/typeorm"
import { Socket } from "socket.io"

@Injectable()
export class ChatsService {
    constructor(
        @InjectRepository(Chat)
        private readonly chatRepository: Repository<Chat>
    ) {}

    async createChat(startupId: number, investorId: number) {
        let chat = await this.chatRepository.findOneBy({
            startup: { id: startupId },
            investor: { id: investorId },
        })
        if (!chat) {
            chat = this.chatRepository.create({
                startup: { id: startupId },
                investor: { id: investorId },
            })
            await this.chatRepository.save(chat)
        }
        return chat
    }

    async getChat(chatId: number) {
        return await this.chatRepository.findOne({
            where: { id: chatId },
            relations: ["messages"],
        })
    }

    async joinChat(chatId: number, client: Socket) {
        client.join(`chat-${chatId}`)
    }
}
