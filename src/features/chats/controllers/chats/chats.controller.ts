import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Param,
    Post,
    Query,
    Req,
    UseGuards,
} from "@nestjs/common"
import { CreateChatDto } from "../../dtos/create-chat-dto"
import { AuthGuard } from "../../../auth/guards/auth.guard"
import { Roles } from "../../../users/constants/roles"
import { ChatsService } from "../../services/chats/chats.service"
import { ChatAccessGuard } from "../../guards/chat-access/chat-access.guard"
import { ChatBetweenUsersDto } from "../../dtos/chat-between-users-dto/chat-between-users-dto"
import { ApiBearerAuth, ApiBody, ApiTags } from "@nestjs/swagger";

@Controller("chats")
@ApiTags('chats')
export class ChatsController {
    constructor(private readonly chatsService: ChatsService) {}

    @ApiBearerAuth()
    @ApiBody({type: CreateChatDto})
    @UseGuards(AuthGuard)
    @Post()
    createChat(@Body() createChatDto: CreateChatDto, @Req() req) {
        if (req.token.payload.role === Roles.STARTUP) {
            if (!createChatDto.investorId) {
                throw new BadRequestException("Investor id is not provided")
            }
            return this.chatsService.createChat(
                req.token.payload.id,
                createChatDto.investorId
            )
        } else if (req.token.payload.role === Roles.INVESTOR) {
            if (!createChatDto.startupId) {
                throw new BadRequestException("Startup id is not provided")
            }
            return this.chatsService.createChat(
                createChatDto.startupId,
                req.token.payload.id
            )
        }
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Get("chatsForUser")
    getChatsForUser(@Req() req) {
        return this.chatsService.getChatsForUser(req.token.payload)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard, ChatAccessGuard)
    @Get("chatBetweenUsers")
    getChatBetweenUsers(
        @Query("startupId") startupId: number,
        @Query("investorId") investorId: number
    ) {
        return this.chatsService.getChatBetweenUsers({ startupId, investorId })
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard, ChatAccessGuard)
    @Get(":id")
    getChat(@Param("id") id: number) {
        return this.chatsService.getChat(id)
    }
}
