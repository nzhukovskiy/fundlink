import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateFundingRoundDto } from "../dtos/create-funding-round-dto";
import { InjectRepository } from "@nestjs/typeorm";
import { FundingRound } from "../entities/funding-round/funding-round";
import { Repository } from "typeorm";
import { Startup } from "../../users/startups/entities/startup";
import { Cron } from "@nestjs/schedule";
import { FundingStage } from "../constants/funding-stage";

@Injectable()
export class FundingRoundsService {
    constructor(@InjectRepository(FundingRound) private readonly fundingRoundRepository: Repository<FundingRound>,
                @InjectRepository(Startup) private readonly startupRepository: Repository<Startup>) {
    }
    async create(startupId: number, createFundingRoundDto: CreateFundingRoundDto) {
        let startup = await this.startupRepository.findOne({where: {id: startupId}, relations: {fundingRounds: true}});
        let fundingRound = await this.fundingRoundRepository.save(createFundingRoundDto);
        if (startup.fundingRounds.length == 0) {
            fundingRound.stage = FundingStage.SEED;
        }
        else {
            let rounds = startup.fundingRounds.sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());
            let stages = Object.values(FundingStage) as FundingStage[];
            let lastStage = rounds[rounds.length - 1].stage;
            let indexOfLastStage = stages.indexOf(lastStage);
            if (indexOfLastStage != stages.length - 1) {
                fundingRound.stage = stages[indexOfLastStage + 1];
            }
            else {
                throw new BadRequestException("Unable to add new round for this startup because all rounds have been already created");
            }
        }
        startup.fundingRounds.push(fundingRound);
        await this.startupRepository.save(startup);
        await this.updateFundingRoundStatus(startup);
        return fundingRound;
    }

    async update(fundingRoundId: number, updateFundingRoundDto: CreateFundingRoundDto) {
        let fundingRound = await this.fundingRoundRepository.findOneBy({ id: fundingRoundId});
        Object.assign(fundingRound, updateFundingRoundDto);
        return this.fundingRoundRepository.save(fundingRound);
    }

    getOne(id: number) {
        return this.fundingRoundRepository.findOne({where: {id: id}, relations: ['startup']});
    }

    async getForStartup(startupId: number) {
        return (await this.startupRepository.findOne({ where: {id: startupId}, relations: {fundingRounds: true}})).fundingRounds;
    }

    async getCurrentFundingRound(startupId: number) {
        return (await this.startupRepository.findOne({
            where: { id: startupId },
            relations: { fundingRounds: true }
        })).fundingRounds.find(el => el.isCurrent);
    }

    async updateFundingRoundStatus(startup: Startup) {
        for (let fundingRound of startup.fundingRounds) {
            let currentDate = new Date();
            if (fundingRound.startDate < currentDate && fundingRound.endDate > currentDate && fundingRound.currentRaised < fundingRound.fundingGoal) {
                fundingRound.isCurrent = true;
                break;
            } else {
                fundingRound.isCurrent = false;
            }
        }
        await this.fundingRoundRepository.save(startup.fundingRounds);
    }

    @Cron('0 0 * * *')
    async checkAndUpdateFundingRounds(): Promise<void> {
        const startups = await this.startupRepository.find({ relations: ['fundingRounds'] });
        for (let startup of startups) {
            await this.updateFundingRoundStatus(startup);
        }
    }
}
