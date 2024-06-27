import { Module } from '@nestjs/common';
import { JwtTokenService } from './services/jwt-token.service';
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get('SECRET'),
                signOptions: { expiresIn: '30d' }
            }),
            global: true
        }),
    ],
    providers: [JwtTokenService],
    exports: [JwtTokenService]
})
export class JwtTokenModule {}
