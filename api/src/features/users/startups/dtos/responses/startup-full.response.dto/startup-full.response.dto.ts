import { Startup } from "../../../entities/startup.entity";
import { Expose } from "class-transformer";

export class StartupFullResponseDto extends Startup {
    @Expose()
    totalInvestment: string;

    @Expose()
    sharePercentage: string;

    @Expose()
    totalInvestmentsForStartup: string;
}
