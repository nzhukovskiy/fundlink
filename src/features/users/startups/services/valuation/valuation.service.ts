import { Startup } from "../../entities/startup"

export abstract class ValuationService {
    abstract valuate(startup: Startup)
}
