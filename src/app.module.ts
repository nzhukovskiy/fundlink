import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { User } from "./features/users/user/user";
import { Startup } from "./features/users/startups/entities/startup";
import { Investor } from "./features/users/investors/entities/investor";
import { StartupsController } from './features/users/startups/controllers/startups/startups.controller';
import { StartupsService } from './features/users/startups/services/startups.service';
import { UsersModule } from './features/users/users.module';
import { InvestmentModule } from './features/investments/investment.module';
import { FundingRound } from "./features/investments/entities/funding-round/funding-round";
import { FundingRoundsController } from './features/investments/controllers/funding-rounds.controller';
import { FundingRoundsService } from './features/investments/services/funding-rounds.service';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get("POSTGRES_HOST"),
                port: 5432,
                username: configService.get("POSTGRES_USER"),
                password: configService.get("POSTGRES_PASSWORD"),
                database: configService.get("POSTGRES_DB").toString(),
                entities: [Startup, Investor, FundingRound],
                synchronize: true,
            }),
        }),
        UsersModule,
        InvestmentModule,
    ],
    controllers: [AppController, StartupsController, FundingRoundsController],
    providers: [AppService, FundingRoundsService],
})
export class AppModule {}
