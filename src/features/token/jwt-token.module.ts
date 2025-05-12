import { Module } from '@nestjs/common';
import { JwtTokenService } from './services/jwt-token.service';
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RefreshTokenService } from './services/refresh-token.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { RefreshToken } from "./entities/refresh-token";

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
            }),
            global: true
        }),
        TypeOrmModule.forFeature([RefreshToken]),
    ],
    providers: [JwtTokenService, RefreshTokenService],
    exports: [JwtTokenService, RefreshTokenService]
})
export class JwtTokenModule {}
