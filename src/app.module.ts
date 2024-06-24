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
                entities: [Startup, Investor],
                synchronize: true,
            }),
        }),
        UsersModule,
    ],
    controllers: [AppController, StartupsController],
    providers: [AppService],
})
export class AppModule {}
