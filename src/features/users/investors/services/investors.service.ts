import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Investor } from "../entities/investor";
import { Repository } from "typeorm";
import { CreateInvestorDto } from "../dtos/create-investor-dto";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { paginate, PaginateQuery } from "nestjs-paginate";
import { PaginateService } from "../../common/services/paginate/paginate.service";

@Injectable()
export class InvestorsService {
    constructor(@InjectRepository(Investor) private readonly investorRepository: Repository<Investor>,
                private readonly jwtService: JwtService,
                private readonly paginateService: PaginateService) {
    }

    getAll(query: PaginateQuery) {
        return this.paginateService.paginate(query, this.investorRepository);
    }

    async getOne(id: number) {
        let investor = await this.investorRepository.findOne({ where: { id: id } });
        if (!investor) {
            throw new NotFoundException(`Investor with an id ${id} does not exist`);
        }
        return investor;
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
