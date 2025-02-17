import { Injectable } from "@nestjs/common"
import { Repository } from "typeorm"
import { Message } from "../../entities/message/message"
import { InjectRepository } from "@nestjs/typeorm"
import { Roles } from "../../../users/constants/roles"
import { CreateMessageDto } from "../../dtos/create-message-dto/create-message-dto"

@Injectable()
export class MessagesService {
    constructor(
        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>
    ) {}

    async saveMessage(
        createMessageDto: CreateMessageDto,
        senderType: Roles,
        senderId: number
    ) {
        const msg = this.messageRepository.create({
            chat: { id: createMessageDto.chatId },
            senderType: senderType,
            senderId: senderId,
            text: createMessageDto.text,
        })
        return this.messageRepository.save(msg);
    }
}
