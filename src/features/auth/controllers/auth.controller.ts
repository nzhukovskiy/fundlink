import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { LoginUserDto } from "../../users/dtos/login-user-dto";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "../guards/auth.guard";
import { RolesGuard } from "../guards/roles.guard";
import { RefreshTokenDto } from "../dtos/refresh-token.dto";
import { RefreshToken } from "../../token/entities/refresh-token";

@Controller('auth')
@ApiTags('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {
    }

    @ApiBody({ type: LoginUserDto })
    @ApiResponse({type: LoginUserDto})
    @Post('login')
    login(@Body() loginUserDto: LoginUserDto) {
        return this.authService.login(loginUserDto);
    }

    @ApiBody({type: RefreshTokenDto})
    @Post('refresh')
    refreshTokens(@Body() body: RefreshTokenDto) {
        return this.authService.refreshTokens(body.refreshToken);
    }
}
