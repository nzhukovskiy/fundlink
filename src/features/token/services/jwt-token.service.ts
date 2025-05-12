import { Injectable } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtTokenService {
    constructor(private readonly jwtService: JwtService,
                private readonly configService: ConfigService) {
    }

    async generateAccessToken(payload: any) {
        console.log(this.configService.get("JWT_ACCESS_SECRET"))
        return this.jwtService.signAsync({payload},
          {
              expiresIn: '1d',
              secret: this.configService.get("JWT_ACCESS_SECRET")
          })
    }

    async verifyAccessToken(token: string) {
        return this.jwtService.verifyAsync(token, {
            secret: this.configService.get("JWT_ACCESS_SECRET")
        });
    }

    async generateRefreshToken(payload: any) {
        console.log(this.configService.get("JWT_REFRESH_SECRET"))
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
