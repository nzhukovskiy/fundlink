import { Startup } from "../../../entities/startup";
import { Expose } from "class-transformer";

export class StartupFundingStatsResponseDto extends Startup {
    @Expose()
    actualFundingGoal: string;

    @Expose()
    currentRaised: string;
}
