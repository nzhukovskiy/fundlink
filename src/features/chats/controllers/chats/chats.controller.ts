import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Param,
    Post,
    Req,
    UseGuards,
} from "@nestjs/common"
import { CreateChatDto } from "../../dtos/create-chat-dto"
import { AuthGuard } from "../../../auth/guards/auth.guard"
import { Roles } from "../../../users/constants/roles"
import { ChatsService } from "../../services/chats/chats.service"

@Controller("chats")
export class ChatsController {
    constructor(private readonly chatsService: ChatsService) {}
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

    @UseGuards(AuthGuard)
    @Get(":id")
    getChatMessages(@Param("id") id: number, @Req() req) {
        return this.chatsService.getChat(id, req.token.payload.id)
    }
}
