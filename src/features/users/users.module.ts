import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Startup } from "./startups/entities/startup";
import { Investor } from "./investors/entities/investor";
import { StartupsController } from "./startups/controllers/startups/startups.controller";
import { StartupsService } from "./startups/services/startups.service";
import { UsersService } from './services/users.service';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { JwtModule } from "@nestjs/jwt";
import { InvestorsController } from './investors/controllers/investors.controller';
import { InvestorsService } from './investors/services/investors.service';

@Module({
    imports: [TypeOrmModule.forFeature([Startup, Investor]),
        JwtModule.register({
            global: true,
            secret: 'secret',
            signOptions: { expiresIn: '30d' },
        }),
    ],
    controllers: [StartupsController, AuthController, InvestorsController],
    providers: [StartupsService, UsersService, AuthService, InvestorsService],
    exports: [StartupsService, UsersService, AuthService]
})
export class UsersModule {}
