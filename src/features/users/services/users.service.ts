import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Startup } from "../startups/entities/startup";
import { Repository } from "typeorm";
import { StartupsService } from "../startups/services/startups.service";
import { Investor } from "../investors/entities/investor";
import { CreateStartupDto } from "../startups/dtos/create-startup-dto";
import { CreateInvestorDto } from "../investors/dtos/create-investor-dto";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { UpdateStartupDto } from "../startups/dtos/update-startup-dto";
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

    // async create(createDto: CreateStartupDto | CreateInvestorDto, repository: Repository<Startup> | Repository<Investor>) {
    //     let dto = createDto;
    //     dto.password = await bcrypt.hash(dto.password, 10);
    //     let savedEntity = await repository.save(dto);
    //     return {
    //         accessToken: await this.jwtService.signAsync({id: savedEntity.id, email: savedEntity.email})
    //     }
    // }

    // async update(id: number, updateDto: UpdateStartupDto | UpdateInvestorDto, repository: Repository<Startup> | Repository<Investor>) {
    //     let startup = await repository.findOne({ where: {id: id} });
    //     if (!startup) {
    //         throw new NotFoundException("Startup does not exist")
    //     }
    //     Object.assign(startup, updateDto);
    //     return repository.save(startup);
    // }
}
