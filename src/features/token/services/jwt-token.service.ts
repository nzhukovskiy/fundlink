import { Injectable } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { User } from "../../users/user/user";
import { Startup } from "../../users/startups/entities/startup";
import { Investor } from "../../users/investors/entities/investor";

@Injectable()
export class JwtTokenService {
    constructor(private readonly jwtService: JwtService,
                private readonly configService: ConfigService) {
    }

    async generateTokens(user: Investor | Startup) {
        delete user.password
        user["role"] = user.getRole()
        return {
            accessToken: await this.generateAccessToken(user),
            refreshToken: await this.generateRefreshToken(user)
        };
    }

    private async generateAccessToken(payload: any) {
        return this.jwtService.signAsync({payload},
          {
              expiresIn: '10m',
              secret: this.configService.get("JWT_ACCESS_SECRET")
          })
    }

    async verifyAccessToken(token: string) {
        return this.jwtService.verifyAsync(token, {
            secret: this.configService.get("JWT_ACCESS_SECRET")
        });
    }

    private async generateRefreshToken(payload: any) {
        return this.jwtService.signAsync({payload},
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
}
