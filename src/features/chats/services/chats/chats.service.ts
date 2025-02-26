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
        let whereClause = {}
        if (user.role === Roles.STARTUP) {
            whereClause = { startupId: user.id }
        } else if (user.role === Roles.INVESTOR) {
            whereClause = { investorId: user.id }
        }
        return await this.chatRepository
            .createQueryBuilder("chat")
            .leftJoinAndSelect("chat.investor", "investor")
            .leftJoinAndSelect("chat.startup", "startup")
            .leftJoinAndSelect(
                "chat.messages",
                "message",
                'message.timestamp = (SELECT MAX(m.timestamp) FROM message m WHERE m."chatId" = chat.id)'
            )
            .where("investor.id = :investorId", whereClause)
            .orderBy("message.timestamp", "DESC")
            .getMany()
    }

    async getChatBetweenUsers(chatBetweenUsersDto: ChatBetweenUsersDto) {
        return await this.chatRepository
            .findOneOrFail({
                where: {
                    startup: { id: chatBetweenUsersDto.startupId },
                    investor: { id: chatBetweenUsersDto.investorId },
                },
                relations: ["messages"],
                order: {
                    messages: {
                        timestamp: "ASC",
                    },
                },
            })
            .catch(() => {
                throw new NotFoundException(
                    `Chat with between investor ${chatBetweenUsersDto.investorId} and startup ${chatBetweenUsersDto.startupId} does not exist`
                )
            })
    }
}
