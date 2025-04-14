import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Startup } from "./startups/entities/startup"
import { Investor } from "./investors/entities/investor"
import { StartupsController } from "./startups/controllers/startups/startups.controller"
import { StartupsService } from "./startups/services/startups.service"
import { UsersService } from "./services/users.service"
import { InvestorsController } from "./investors/controllers/investors.controller"
import { InvestorsService } from "./investors/services/investors.service"
import { FundingRound } from "../investments/entities/funding-round/funding-round"
import { InvestmentModule } from "../investments/investment.module"
import { JwtTokenModule } from "../token/jwt-token.module"
import { Investment } from "../investments/entities/investment/investment"
import { Tag } from "../tags/entities/tag/tag"
import { PaginateModule } from "../../common/paginate/paginate.module"
import { RecommendationService } from './investors/services/recommendation/recommendation.service';

@Module({
    imports: [TypeOrmModule.forFeature([Startup, Investor, FundingRound, Investment, Tag]),
        InvestmentModule,
        JwtTokenModule,
        PaginateModule,
    ],
    controllers: [StartupsController, InvestorsController],
    providers: [StartupsService, UsersService, InvestorsService, RecommendationService],
    exports: [StartupsService, UsersService],
})
export class UsersModule {
}
