import { Injectable, UnauthorizedException } from "@nestjs/common";
import { LoginUserDto } from "../../users/dtos/login-user-dto";
import { UsersService } from "../../users/services/users.service";
import * as bcrypt from "bcrypt";
import { JwtTokenService } from "../../token/services/jwt-token.service";
import { ErrorCode } from "../../../constants/error-code";
import { RefreshTokenService } from "../../token/services/refresh-token.service";

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService,
                private readonly jwtTokenService: JwtTokenService,
                private readonly refreshTokenService: RefreshTokenService) {
    }

    async login(loginUserDto: LoginUserDto) {
        let user = await this.usersService.findByEmail(loginUserDto.email);
        if (user && await bcrypt.compare(loginUserDto.password, user.password)) {
            delete user.password
            user["role"] = user.getRole()
            const tokens = {
                accessToken: await this.jwtTokenService.generateAccessToken(user),
                refreshToken: await this.jwtTokenService.generateRefreshToken(user)
            };
            const decoded = await this.jwtTokenService.decode(tokens.refreshToken);
            await this.refreshTokenService.create({
                userId: user.id,
                userType: user.getRole(),
                token: tokens.refreshToken,
                expiresAt: new Date(decoded.exp * 1000),
            })
            return tokens
        }
        throw new UnauthorizedException({
            errorCode: ErrorCode.UNAUTHORIZED,
            message: "Wrong login or password"
        });
    }

}
