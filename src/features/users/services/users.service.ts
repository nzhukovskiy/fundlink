import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Startup } from "../startups/entities/startup.entity";
import { Repository } from "typeorm";
import { StartupsService } from "../startups/services/startups.service";
import { Investor } from "../investors/entities/investor";
import { CreateStartupDto } from "../startups/dtos/requests/create-startup-dto";
import { CreateInvestorDto } from "../investors/dtos/create-investor-dto";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { UpdateStartupDto } from "../startups/dtos/requests/update-startup-dto";
import { UpdateInvestorDto } from "../investors/dtos/update-investor-dto";

@Injectable()
export class UsersService {
    constructor(@InjectRepository(Startup) private readonly startupRepository: Repository<Startup>,
                @InjectRepository(Investor) private readonly investorRepository: Repository<Investor>,
                private readonly jwtService: JwtService) {
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
