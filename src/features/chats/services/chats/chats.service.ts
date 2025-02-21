import { Injectable, NotFoundException } from "@nestjs/common"
import { Repository } from "typeorm"
import { Chat } from "../../entities/chat/chat"
import { InjectRepository } from "@nestjs/typeorm"
import { Socket } from "socket.io"
import { Roles } from "../../../users/constants/roles"
import { ChatBetweenUsersDto } from "../../dtos/chat-between-users-dto/chat-between-users-dto"

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
        const chat = await this.chatRepository.findOne({
            where: { id: chatId },
            relations: ["messages"],
        })
        if (!chat) {
            throw new NotFoundException(
                `Chat with an id ${chatId} does not exist`
            )
        }
        return chat
    }

    async joinChat(chatId: number, client: Socket) {
        client.join(`chat-${chatId}`)
    }

    async getChatsForUser(user: any) {
        if (user.role === Roles.STARTUP) {
            return await this.chatRepository.find({
                where: { startup: { id: user.id } },
                relations: ["messages"],
            })
        } else if (user.role === Roles.INVESTOR) {
            return await this.chatRepository.find({
                where: { investor: { id: user.id } },
                relations: ["messages"],
            })
        }
    }

    async getChatBetweenUsers(chatBetweenUsersDto: ChatBetweenUsersDto) {
        return await this.chatRepository
            .findOneOrFail({
                where: {
                    startup: { id: chatBetweenUsersDto.startupId },
                    investor: { id: chatBetweenUsersDto.investorId },
                },
                relations: ["messages"],
            })
            .catch(() => {
                throw new NotFoundException(
                    `Chat with between investor ${chatBetweenUsersDto.investorId} and startup ${chatBetweenUsersDto.startupId} does not exist`
                )
            })
    }
}
