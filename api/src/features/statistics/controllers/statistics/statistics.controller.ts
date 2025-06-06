import { Controller, Get } from "@nestjs/common";
import { StatisticsService } from "../../services/statistics/statistics.service";
import { ApiTags } from "@nestjs/swagger";

@Controller('statistics')
@ApiTags('statistics')
export class StatisticsController {

    constructor(private readonly statisticsService: StatisticsService) {
    }
    @Get('main-stats')
    getMainStats() {
        return this.statisticsService.getMainStats();
    }
}
