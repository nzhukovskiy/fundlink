import { Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { ConfigService } from "@nestjs/config"
import { Startup } from "../../users/startups/entities/startup.entity"
import { Investor } from "../../users/investors/entities/investor"
import { FullTokenDto } from "../../auth/dtos/full-token.dto"
import { randomUUID } from "crypto"


@Injectable()
export class JwtTokenService {
    constructor(private readonly jwtService: JwtService,
                private readonly configService: ConfigService) {
    }

    async generateTokens(user: Investor | Startup) {
        if (user.password) {
            delete user.password
        }
        if (!user["role"]) {
            user["role"] = user.getRole()
        }

        return {
            accessToken: await this.generateAccessToken(user),
            refreshToken: await this.generateRefreshToken(user)
        } as FullTokenDto;
    }

    private async generateAccessToken(payload: any) {
        return this.jwtService.signAsync({payload},
          {
              expiresIn: '15m',
              secret: this.configService.get("JWT_ACCESS_SECRET")
          })
    }

    async verifyAccessToken(token: string) {
        return this.jwtService.verifyAsync(token, {
            secret: this.configService.get("JWT_ACCESS_SECRET")
        });
    }

    private async generateRefreshToken(payload: any) {
        const refreshPayload = {
            ...payload,
            jti: randomUUID(),
        };
        return this.jwtService.signAsync(refreshPayload,
          {
              expiresIn: '10d',
              secret: this.configService.get("JWT_REFRESH_SECRET")
          })
    }

    async verifyRefreshToken(token: string) {
        return this.jwtService.verifyAsync(token, {
            secret: this.configService.get("JWT_REFRESH_SECRET")
        });
    }

    async decode(token: string) {
        return this.jwtService.decode(token)
    }

    async generateApiToken() {
        return this.jwtService.signAsync({service: "fundlink-api"},
          {
              expiresIn: '15m',
              secret: this.configService.get("JWT_API_SECRET")
          })
    }
}
