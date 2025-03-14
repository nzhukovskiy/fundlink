import { Injectable, NotFoundException } from "@nestjs/common"
import { Repository } from "typeorm"
import { Chat } from "../../entities/chat/chat"
import { InjectRepository } from "@nestjs/typeorm"
import { Socket } from "socket.io"
import { Roles } from "../../../users/constants/roles"
import { ChatBetweenUsersDto } from "../../dtos/chat-between-users-dto/chat-between-users-dto"
import { plainToInstance } from "class-transformer";
import {
    ChatAndUnreadMessageCountResponseDto
} from "../../dtos/responses/chat-and-unread-message-count.response.dto/chat-and-unread-message-count.response.dto";
import { Message } from "../../entities/message/message";

@Injectable()
export class ChatsService {
    constructor(
        @InjectRepository(Chat)
        private readonly chatRepository: Repository<Chat>,
        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>
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
            order: {
                messages: {
                    timestamp: "ASC",
                },
            },
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
        console.log(client.data.user, "with id", client.id, "joined", `chat-${chatId}`)
    }

    async getChatsForUser(user: any) {
        let whereParams = {}
        let whereString = ""
        if (user.role === Roles.STARTUP) {
            whereParams = { startupId: user.id }
            whereString = "startup.id = :startupId"
        } else if (user.role === Roles.INVESTOR) {
            whereParams = { investorId: user.id }
            whereString = "investor.id = :investorId"
        }
        const unreadCountSubQuery = await this.messageRepository.createQueryBuilder("message")
          .where("message.chatId = chat.id")
          .andWhere("message.readAt isnull")
          .select("COUNT (message.id)")
        const raw = await this.chatRepository
            .createQueryBuilder("chat")
            .leftJoinAndSelect("chat.investor", "investor")
            .leftJoinAndSelect("chat.startup", "startup")
            .leftJoinAndSelect(
                "chat.messages",
                "message",
                'message.timestamp = (SELECT MAX(m.timestamp) FROM message m WHERE m."chatId" = chat.id)'
            )
            .addSelect(`(${unreadCountSubQuery.getQuery()})`, 'unreadCount')
            .where(whereString, whereParams)
            .orderBy("message.timestamp", "DESC")
            .getRawAndEntities()

        return raw.entities.map((chat) => {
            const rawRow = raw.raw.find((raw) => raw.chat_id === chat.id);
            return {
                ...chat,
                unreadCount: rawRow ? Number(rawRow.unreadCount) : 0,
            };
        });
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


    async getChatAndLastMessage(chatId: number) {
        const unreadCountSubQuery = await this.chatRepository.createQueryBuilder("chat")
          .leftJoinAndSelect("chat.messages", "message")
          .where("chat.id = :id", {id: chatId})
          .andWhere("message.readAt isnull")
          .select("COUNT (message.id)")
        const chatRaw = await this.chatRepository
          .createQueryBuilder("chat")
          .leftJoinAndSelect("chat.investor", "investor")
          .leftJoinAndSelect("chat.startup", "startup")
          .leftJoinAndSelect(
            "chat.messages",
            "message",
            'message.timestamp = (SELECT MAX(m.timestamp) FROM message m WHERE m."chatId" = chat.id)'
          )
          .addSelect(`(${unreadCountSubQuery.getQuery()})`, "unreadCount")
          .where("chat.id = :id", {id: chatId})
          .orderBy("message.timestamp", "DESC")
          .getRawAndEntities()

        return {
            ...chatRaw.entities[0],
            unreadCount: chatRaw.raw[0].unreadCount
        }
    }
}
