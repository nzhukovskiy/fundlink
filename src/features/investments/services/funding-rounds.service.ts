import { Injectable } from '@nestjs/common';
import { CreateFundingRoundDto } from "../dtos/create-funding-round-dto";
import { InjectRepository } from "@nestjs/typeorm";
import { FundingRound } from "../entities/funding-round/funding-round";
import { Repository } from "typeorm";
import { Startup } from "../../users/startups/entities/startup";

@Injectable()
export class FundingRoundsService {
    constructor(@InjectRepository(FundingRound) private readonly fundingRoundRepository: Repository<FundingRound>,
                @InjectRepository(Startup) private readonly startupRepository: Repository<Startup>) {
    }
    async create(startupId: number, createFundingRoundDto: CreateFundingRoundDto) {
        let startup = await this.startupRepository.findOneBy({id: startupId});
        let fundingRound = await this.fundingRoundRepository.save(createFundingRoundDto);
        startup.fundingRounds.push(fundingRound);
        await this.startupRepository.save(startup);
        return fundingRound;
    }
}
