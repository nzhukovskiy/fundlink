import {ResolveFn} from '@angular/router';
import {Investor} from "../data/models/investor";
import {InvestorsService} from "../services/investors.service";
import { genericResolver } from './generic.resolver';
import {InvestorStatsDto} from "../data/dtos/responses/investor-stats.dto";

export const investorResolver: ResolveFn<{investor: Investor, stats: InvestorStatsDto}> =
    genericResolver(
        InvestorsService,
        (service, id) => service.getInvestorAndStats(id)
    )
