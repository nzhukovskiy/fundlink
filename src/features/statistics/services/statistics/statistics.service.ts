import { Injectable } from '@nestjs/common';
import { InvestmentService } from "../../../investments/services/investment.service";
import { StartupsService } from "../../../users/startups/services/startups.service";
import { MainStatisticsDto } from "../../dtos/main-statistics.dto/main-statistics.dto";
import { InvestorsService } from "../../../users/investors/services/investors.service";

@Injectable()
export class StatisticsService {

    constructor(private readonly investmentService: InvestmentService,
                private readonly startupsService: StartupsService,
                private readonly investorsService: InvestorsService) {
    }

    async getMainStats() {
        return {
            totalRaised: (await this.investmentService.getTotalInvestments()).totalInvestments,
            totalStartups: await this.startupsService.getStartupsNumber(),
            newStartupsPerLastMonth: await this.startupsService.getRecentlyJoinedNumber(),
            totalInvestors: await this.investorsService.getInvestorsNumber()
        } as MainStatisticsDto;
    }

    getInvestorStats
}
