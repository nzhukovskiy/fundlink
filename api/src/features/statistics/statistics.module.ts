import { Module } from "@nestjs/common"
import { StatisticsController } from "./controllers/statistics/statistics.controller"
import { StatisticsService } from "./services/statistics/statistics.service"
import { InvestmentModule } from "../investments/investment.module"
import { UsersModule } from "../users/users.module"

@Module({
    controllers: [StatisticsController],
    providers: [StatisticsService],
    imports: [UsersModule, InvestmentModule]
})
export class StatisticsModule {
}
