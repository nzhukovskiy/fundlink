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
            const tokens = await this.jwtTokenService.generateTokens(user)
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

    async refreshTokens(refreshToken: string) {
        const payload = await this.jwtTokenService.verifyRefreshToken(refreshToken)
        if (!payload) {
            throw new UnauthorizedException({
                errorCode: ErrorCode.INVALID_REFRESH_TOKEN,
                message: "Invalid refresh token"
            })
        }

        const token = await this.refreshTokenService.findToken(refreshToken)
        if (!token || token.revoked || token.expiresAt < new Date()) {
            throw new UnauthorizedException({
                errorCode: ErrorCode.INVALID_REFRESH_TOKEN,
                message: "Invalid refresh token"
            })
        }

        const oldRefreshToken = await this.refreshTokenService.findToken(refreshToken)
        await this.refreshTokenService.revokeToken(oldRefreshToken)

        const newTokens = await this.jwtTokenService.generateTokens(payload.payload)
        // const newAccessToken = await this.jwtTokenService.generateAccessToken(payload.payload)
        // const newRefreshToken = await this.jwtTokenService.generateRefreshToken(payload.payload)

        await this.refreshTokenService.create({
            userId: payload.payload.id,
            userType: payload.payload.role,
            token: newTokens.refreshToken,
            expiresAt: new Date((await this.jwtTokenService.decode(newTokens.refreshToken)).exp * 1000),
        })
        return {
            accessToken: newTokens.accessToken,
            refreshToken: newTokens.refreshToken
        }
    }

}
