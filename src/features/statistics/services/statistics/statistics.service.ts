import { Injectable } from "@nestjs/common"
import { InvestmentService } from "../../../investments/services/investment.service"
import { MainStatisticsDto } from "../../dtos/main-statistics.dto/main-statistics.dto"
import { InvestorsService } from "../../../users/investors/services/investors.service"
import { StartupsStatsService } from "../../../users/startups/services/startups-stats/startups-stats.service"

@Injectable()
export class StatisticsService {
    constructor(
        private readonly investmentService: InvestmentService,
        private readonly investorsService: InvestorsService,
        private readonly startupsStatsService: StartupsStatsService
    ) {}

    async getMainStats() {
        return {
            totalRaised: (await this.investmentService.getTotalInvestments())
                .totalInvestments,
            totalStartups: await this.startupsStatsService.getStartupsNumber(),
            newStartupsPerLastMonth:
                await this.startupsStatsService.getRecentlyJoinedNumber(),
            totalInvestors: await this.investorsService.getInvestorsNumber(),
        } as MainStatisticsDto
    }
}
