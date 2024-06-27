import { Module } from '@nestjs/common';
import { AuthController } from "./controllers/auth.controller";
import { AuthService } from "./services/auth.service";
import { UsersModule } from "../users/users.module";
import { JwtTokenModule } from "../token/jwt-token.module";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [UsersModule,
        JwtTokenModule,
        ConfigModule],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService]
})
export class AuthModule {}
