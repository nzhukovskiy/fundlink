import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Startup } from "./startups/entities/startup.entity"
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
import { Exit } from "./startups/entities/exit"
import { DcfValuationService } from "./startups/services/valuation/dcf-valuation.service"
import { ValuationService } from "./startups/services/valuation/valuation.service"
import { StartupsStatsService } from "./startups/services/startups-stats/startups-stats.service"
import { StartupsRepository } from "./startups/repositories/startups/startups.repository"
import { InvestorsRepository } from "./investors/repositories/investors/investors.repository";
import { HttpModule } from "@nestjs/axios";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Startup,
            Investor,
            FundingRound,
            Investment,
            Tag,
            Exit,
        ]),
        InvestmentModule,
        JwtTokenModule,
        PaginateModule,
        HttpModule
    ],
    controllers: [StartupsController, InvestorsController],
    providers: [
        StartupsService,
        UsersService,
        InvestorsService,
        {
            provide: ValuationService,
            useClass: DcfValuationService,
        },
        StartupsStatsService,
        StartupsRepository,
        InvestorsRepository
    ],
    exports: [
        StartupsService,
        UsersService,
        InvestorsService,
        StartupsStatsService,
    ],
})
export class UsersModule {}
