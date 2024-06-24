import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Investor } from "../entities/investor";
import { Repository } from "typeorm";
import { CreateInvestorDto } from "../dtos/create-investor-dto";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class InvestorsService {
    constructor(@InjectRepository(Investor) private readonly investorRepository: Repository<Investor>,
                private readonly jwtService: JwtService) {
    }

    getAll() {
        return this.investorRepository.find();
    }

    async create(createInvestorDto: CreateInvestorDto) {
        let investor = createInvestorDto;
        investor.password = await bcrypt.hash(investor.password, 10);
        let savedInvestor = await this.investorRepository.save(investor);
        return {
            accessToken: await this.jwtService.signAsync({id: savedInvestor.id, email: savedInvestor.email})
        }
    }
}
