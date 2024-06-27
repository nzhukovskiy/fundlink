import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { FundingRound } from "./entities/funding-round/funding-round";
import { Startup } from "../users/startups/entities/startup";
import { FundingRoundsController } from "./controllers/funding-rounds.controller";
import { FundingRoundsService } from "./services/funding-rounds.service";
import { Investment } from "./entities/investment/investment";
import { InvestmentService } from './services/investment.service';
import { JwtTokenModule } from "../token/jwt-token.module";
import { Investor } from "../users/investors/entities/investor";

@Module({
    imports: [TypeOrmModule.forFeature([FundingRound, Startup, Investment, Investor]),
    JwtTokenModule],
    controllers: [FundingRoundsController],
    providers: [FundingRoundsService, InvestmentService],
    exports: [FundingRoundsService, InvestmentService]
})
export class InvestmentModule {}
