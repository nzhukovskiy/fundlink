import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Startup } from "../startups/entities/startup";
import { Repository } from "typeorm";
import { StartupsService } from "../startups/services/startups.service";
import { Investor } from "../investors/entities/investor";

@Injectable()
export class UsersService {
    constructor(@InjectRepository(Startup) private readonly startupRepository: Repository<Startup>,
                @InjectRepository(Investor) private readonly investorRepository: Repository<Investor>) {
    }
    async findByEmail(email: string) {
        let investor = await this.investorRepository.findOne({
              where: { email: email },
              select: { password: true, email: true, id: true }
        })
        if (investor) {
            return investor;
        }
        return this.startupRepository.findOne({where: {email: email}, select: {password: true, email: true, id: true}})
    }
}
