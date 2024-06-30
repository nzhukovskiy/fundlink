import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { LoginUserDto } from "../../users/dtos/login-user-dto";
import { ApiBody, ApiTags } from "@nestjs/swagger";

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
}
