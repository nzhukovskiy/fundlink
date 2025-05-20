import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { FundingRound } from "./entities/funding-round/funding-round";
import { Startup } from "../users/startups/entities/startup.entity";
import { FundingRoundsController } from "./controllers/funding-rounds.controller";
import { FundingRoundsService } from "./services/funding-rounds.service";
import { Investment } from "./entities/investment/investment";
import { InvestmentService } from './services/investment.service';
import { JwtTokenModule } from "../token/jwt-token.module";
import { Investor } from "../users/investors/entities/investor";
import { InvestmentsController } from './controllers/investments/investments.controller';
import { ChangeProposalService } from './services/change-proposal-service/change-proposal.service';
import { FundingRoundChangeProposal } from "./entities/funding-round-change-proposal/funding-round-change-proposal";
import { InvestorVote } from "./entities/investor-vote/investor-vote";
import { InvestorVoteService } from './services/investor-vote-service/investor-vote.service';
import { ProposalsController } from './controllers/proposal/proposals.controller';
import { InvestmentsRepository } from "./repositories/investments/investments.repository";

@Module({
    imports: [
        TypeOrmModule.forFeature([FundingRound, Startup, Investment, Investor, FundingRoundChangeProposal, InvestorVote]),
        JwtTokenModule
    ],
    controllers: [FundingRoundsController, InvestmentsController, ProposalsController],
    providers: [FundingRoundsService, InvestmentService, ChangeProposalService, InvestorVoteService, InvestmentsRepository],
    exports: [FundingRoundsService, InvestmentService, InvestmentsRepository]
})
export class InvestmentModule {}
