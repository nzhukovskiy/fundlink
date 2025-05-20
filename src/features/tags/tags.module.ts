import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Startup } from "../users/startups/entities/startup.entity";
import { Investor } from "../users/investors/entities/investor";
import { FundingRound } from "../investments/entities/funding-round/funding-round";
import { Investment } from "../investments/entities/investment/investment";
import { Tag } from "./entities/tag/tag";
import { InvestmentModule } from "../investments/investment.module";
import { JwtTokenModule } from "../token/jwt-token.module";
import { StartupsController } from "../users/startups/controllers/startups/startups.controller";
import { InvestorsController } from "../users/investors/controllers/investors.controller";
import { StartupsService } from "../users/startups/services/startups.service";
import { UsersService } from "../users/services/users.service";
import { InvestorsService } from "../users/investors/services/investors.service";
import { TagsController } from './controllers/tags/tags.controller';
import { TagsService } from './services/tags/tags.service';

@Module({
    imports: [TypeOrmModule.forFeature([Tag])],
    controllers: [TagsController],
    providers: [TagsService],
    exports: []
})
export class TagsModule {

}
