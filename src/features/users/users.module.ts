import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Startup } from "./startups/entities/startup";
import { Investor } from "./investors/entities/investor";
import { StartupsController } from "./startups/controllers/startups/startups.controller";
import { StartupsService } from "./startups/services/startups.service";
import { UsersService } from './services/users.service';
import { AuthService } from '../auth/services/auth.service';
import { AuthController } from '../auth/controllers/auth.controller';
import { InvestorsController } from './investors/controllers/investors.controller';
import { InvestorsService } from './investors/services/investors.service';
import { PaginateService } from './common/services/paginate/paginate.service';
import { FundingRound } from "../investments/entities/funding-round/funding-round";
import { InvestmentModule } from "../investments/investment.module";
import { JwtTokenModule } from "../token/jwt-token.module";

@Module({
    imports: [TypeOrmModule.forFeature([Startup, Investor, FundingRound]),
      InvestmentModule,
      JwtTokenModule
    ],
    controllers: [StartupsController, InvestorsController],
    providers: [StartupsService, UsersService, InvestorsService, PaginateService],
    exports: [StartupsService, UsersService]
})
export class UsersModule {}
