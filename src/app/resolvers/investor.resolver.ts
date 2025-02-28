import {ResolveFn} from '@angular/router';
import {Investor} from "../data/models/investor";
import {InvestorsService} from "../services/investors.service";
import { genericResolver } from './generic.resolver';

export const investorResolver: ResolveFn<Investor> =
    genericResolver(
        InvestorsService,
        (service, id) => service.getOne(id)
    )
