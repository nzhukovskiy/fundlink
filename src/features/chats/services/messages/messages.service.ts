import { Injectable } from "@nestjs/common"
import { Repository } from "typeorm"
import { Message } from "../../entities/message/message"
import { InjectRepository } from "@nestjs/typeorm"
import { Roles } from "../../../users/constants/roles"
import { CreateMessageDto } from "../../dtos/create-message-dto/create-message-dto"
import { ChatsService } from "../chats/chats.service"
import { Chat } from "../../entities/chat/chat"

@Injectable()
export class MessagesService {
    constructor(
        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>,
        private readonly chatsService: ChatsService,
    ) {
    }

    async saveMessage(
        createMessageDto: CreateMessageDto,
        senderType: Roles,
        senderId: number
    ) {
        let chat: Chat
        if (createMessageDto.chatId) {
            chat = await this.chatsService.getChat(createMessageDto.chatId)
        }
        if (!chat) {
            if (senderType === Roles.STARTUP) {
                chat = await this.chatsService.createChat(
                    senderId,
                    createMessageDto.receiverId
                )
            } else if (senderType === Roles.INVESTOR) {
                chat = await this.chatsService.createChat(
                    createMessageDto.receiverId,
                    senderId
                )
            }
        }
        const msg = this.messageRepository.create({
            chat: { id: chat.id },
            senderType: senderType,
            senderId: senderId,
            text: createMessageDto.text
        })
        return this.messageRepository.save(msg)
    }

    async markAsRead(messageId: number) {
        let message = await this.messageRepository.findOne({where: { id: messageId }, relations: ["chat"]})
        message.readAt = new Date();
        return this.messageRepository.save(message);
    }
}
