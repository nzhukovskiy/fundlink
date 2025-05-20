import { Startup } from "../../entities/startup.entity"

export abstract class ValuationService {
    abstract valuate(startup: Startup)
}
