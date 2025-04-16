import { Controller, Get } from "@nestjs/common";
import { StatisticsService } from "../../services/statistics/statistics.service";

@Controller('statistics')
export class StatisticsController {

    constructor(private readonly statisticsService: StatisticsService) {
    }
    @Get('main-stats')
    getMainStats() {
        return this.statisticsService.getMainStats();
    }
}
