import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { LoginUserDto } from "../../users/dtos/login-user-dto";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "../guards/auth.guard";
import { RolesGuard } from "../guards/roles.guard";

@Controller('auth')
@ApiTags('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {
    }

    @ApiBody({ type: LoginUserDto })
    @Post('login')
    login(@Body() loginUserDto: LoginUserDto) {
        return this.authService.login(loginUserDto);
    }

    @Post('refresh')
    refreshTokens(@Body() body: { refreshToken: string }) {
        return this.authService.refreshTokens(body.refreshToken);
    }
}
