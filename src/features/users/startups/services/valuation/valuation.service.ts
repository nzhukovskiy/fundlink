import { DcfDetailedDto } from "../../dtos/responses/dcf-detailed.dto/dcf-detailed.dto"
import { Startup } from "../../entities/startup"

export abstract class ValuationService {
    abstract valuate(startup: Startup);
}
