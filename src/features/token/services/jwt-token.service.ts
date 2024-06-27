import { Injectable } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtTokenService {
    constructor(private readonly jwtService: JwtService) {
    }

    async generateToken(payload: any) {
        return {
            access_token: await this.jwtService.signAsync({payload}, {expiresIn: '10d'}),
        };
    }

    async verifyToken(token: string) {
        return this.jwtService.verifyAsync(token);
    }
}
