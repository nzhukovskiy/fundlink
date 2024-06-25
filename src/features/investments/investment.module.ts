import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { FundingRound } from "./entities/funding-round/funding-round";
import { Startup } from "../users/startups/entities/startup";
import { FundingRoundsController } from "./controllers/funding-rounds.controller";
import { FundingRoundsService } from "./services/funding-rounds.service";

@Module({
    imports: [TypeOrmModule.forFeature([FundingRound, Startup])],
    controllers: [FundingRoundsController],
    providers: [FundingRoundsService],
    exports: [FundingRoundsService]
})
export class InvestmentModule {}
