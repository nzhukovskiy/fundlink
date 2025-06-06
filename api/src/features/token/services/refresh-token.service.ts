import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { RefreshToken } from "../entities/refresh-token";
import { Repository } from "typeorm";
import { CreateRefreshTokenDto } from "../dtos/create-refresh-token.dto";

@Injectable()
export class RefreshTokenService {

    constructor(@InjectRepository(RefreshToken) private readonly refreshTokenRepository: Repository<RefreshToken>) {
    }

    create(createRefreshTokenDto: CreateRefreshTokenDto) {
        const token = this.refreshTokenRepository.create(createRefreshTokenDto);
        return this.refreshTokenRepository.save(token);
    }

    findToken(token: string) {
        return this.refreshTokenRepository.findOne({where: {token: token}})
    }

    async revokeToken(token: RefreshToken) {
        token.revoked = true
        return this.refreshTokenRepository.save(token)
    }
}
