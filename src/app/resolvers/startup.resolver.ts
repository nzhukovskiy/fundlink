import {ResolveFn} from '@angular/router';
import {Startup} from "../data/models/startup";
import {StartupService} from "../services/startup.service";
import { genericResolver } from './generic.resolver';

export const startupResolver: ResolveFn<Startup> =
    genericResolver(
        StartupService,
        (service, id) => service.getOne(id)
    )
