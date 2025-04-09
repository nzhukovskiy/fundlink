import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateFundingRoundDto } from "../dtos/create-funding-round-dto";
import { InjectRepository } from "@nestjs/typeorm";
import { FundingRound } from "../entities/funding-round/funding-round";
import { Repository } from "typeorm";
import { Startup } from "../../users/startups/entities/startup";
import { Cron } from "@nestjs/schedule";
import { FundingStage } from "../constants/funding-stage";
import Decimal from "decimal.js";
import { User } from "../../users/user/user";
import { NotificationTimings } from "../constants/notification-timings";
import { FundingRoundNotificationsTimings } from "../constants/funding-round-notifications-timings";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Roles } from "../../users/constants/roles";
import { NotificationTypes } from "../../notifications/constants/notification-types";
import { CreateNotificationDto } from "../../notifications/entities/dtos/create-notification.dto";
import { ChangeProposalService } from "./change-proposal-service/change-proposal.service";

@Injectable()
export class FundingRoundsService {
    constructor(@InjectRepository(FundingRound) private readonly fundingRoundRepository: Repository<FundingRound>,
                @InjectRepository(Startup) private readonly startupRepository: Repository<Startup>,
                private readonly eventEmitter2: EventEmitter2,
                private readonly changeProposalService: ChangeProposalService) {
    }
    async create(startupId: number, createFundingRoundDto: CreateFundingRoundDto) {
        let startup = await this.startupRepository.findOne({where: {id: startupId}, relations: {fundingRounds: true}});
        await this.ensureNoRoundsOverlap(createFundingRoundDto, startup.id);
        let fundingRound = await this.fundingRoundRepository.create(createFundingRoundDto);
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
        fundingRound.startup = startup;
        await this.fundingRoundRepository.save(fundingRound);
        await this.updateFundingRoundStatus(startup.id);
        delete fundingRound.startup.fundingRounds;
        return fundingRound;
    }

    async update(fundingRoundId: number, updateFundingRoundDto: CreateFundingRoundDto, startupData: User) {
        let fundingRound = await this.getOne(fundingRoundId);
        if (fundingRound.startup.id !== startupData.id) {
            throw new ForbiddenException("Not allowed to perform this action");
        }
        if (fundingRound.investments.length) {
            this.validateBaseConstraints(fundingRound, updateFundingRoundDto);
            if (updateFundingRoundDto.fundingGoal !== fundingRound.fundingGoal ||
              new Date(updateFundingRoundDto.endDate).getTime() !== new Date(fundingRound.endDate).getTime()) {
                await this.changeProposalService.create(fundingRound, {
                    newFundingGoal: updateFundingRoundDto.fundingGoal !== fundingRound.fundingGoal ? updateFundingRoundDto.fundingGoal: undefined,
                    newEndDate: new Date(updateFundingRoundDto.endDate).getTime() !== new Date(fundingRound.endDate).getTime() ? updateFundingRoundDto.endDate: undefined
                })
            }

        }
        // await this.ensureNoRoundsOverlap(updateFundingRoundDto, fundingRound.startup.id, fundingRoundId);
        // Object.assign(fundingRound, updateFundingRoundDto);
        // let savedFundingRound = await this.fundingRoundRepository.save(fundingRound);
        // await this.updateFundingRoundStatus(fundingRound.startup.id);
        // return savedFundingRound;
    }

    async getOne(id: number) {
        let fundingRound = await this.fundingRoundRepository.findOne({
            where: { id: id },
            relations: ['startup', 'investments', 'investments.investor']
        });
        if (!fundingRound) {
            throw new NotFoundException(`Funding round with an id ${id} does not exist`);
        }
        return fundingRound;
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

    async addFunds(fundingRound: FundingRound, amount: string) {
        let currentRaised = new Decimal(fundingRound.currentRaised);
        fundingRound.currentRaised = currentRaised.plus(new Decimal(amount)).toString();
        await this.fundingRoundRepository.save(fundingRound);
        await this.updateFundingRoundStatus(fundingRound.startup.id);
    }

    async updateFundingRoundStatus(startupId?: number, startup?: Startup) {
        if (typeof startup === 'undefined') {
            startup = await this.startupRepository.findOne({where: {id: startupId}, relations: {fundingRounds: true}});
        }
        for (let fundingRound of startup.fundingRounds) {
            let currentDate = new Date();
            if (fundingRound.startDate < currentDate && fundingRound.endDate > currentDate &&
              new Decimal(fundingRound.currentRaised).minus(new Decimal(fundingRound.fundingGoal)) < new Decimal(0)) {
                fundingRound.isCurrent = true;
                const timingsValueAndMessages = [
                    { type: NotificationTimings.SEVEN_DAY, value: FundingRoundNotificationsTimings[NotificationTimings.SEVEN_DAY], message: `До конца раунда ${fundingRound.stage} осталось 7 дней` },
                    { type: NotificationTimings.THREE_DAY, value: FundingRoundNotificationsTimings[NotificationTimings.THREE_DAY], message: `До конца раунда ${fundingRound.stage} осталось 3 дня` },
                    { type: NotificationTimings.ONE_DAY, value: FundingRoundNotificationsTimings[NotificationTimings.ONE_DAY], message: `До конца раунда ${fundingRound.stage} остался 1 день`},
                ];

                const endTime = fundingRound.endDate.getTime();
                const remainingTime = endTime - currentDate.getTime();

                for (const { type, value, message } of timingsValueAndMessages) {
                    if (remainingTime <= value && !fundingRound.notificationsSent.includes(type)) {
                        this.eventEmitter2.emit("notification", {
                            userId: startupId ? startupId : startup.id,
                            userType: Roles.STARTUP,
                            type: NotificationTypes.FUNDING_ROUND_DEADLINE,
                            text: message,
                        } as CreateNotificationDto)
                        fundingRound.notificationsSent = [...fundingRound.notificationsSent, type];
                    }
                }
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
            await this.updateFundingRoundStatus(undefined, startup);
        }
    }

    async ensureNoRoundsOverlap(newRound: CreateFundingRoundDto, startupId: number, fundingRoundId?: number) {
        let startup = await this.startupRepository.findOne({where: {id: startupId}, relations: {fundingRounds: true}});
        for (const round of startup.fundingRounds) {
            if (typeof fundingRoundId !== 'undefined' && round.id == fundingRoundId) {
                continue;
            }
            if ((new Date(newRound.startDate) >= new Date(round.startDate) && new Date(newRound.startDate) <= new Date(round.endDate)) ||
              (new Date(newRound.endDate) >= new Date(round.startDate) && new Date(newRound.endDate) <= new Date(round.endDate)) ||
              (new Date(newRound.startDate) <= new Date(round.startDate) && new Date(newRound.endDate) >= new Date(round.endDate))
            ) {
                throw new BadRequestException('New funding round dates overlap with existing rounds for this startup');
            }
        }
    }

    async delete(id: number, startupData: User) {
        let fundingRound = await this.getOne(id);
        if (fundingRound.startup.id !== startupData.id) {
            throw new ForbiddenException("Not allowed to perform this action");
        }
        if (fundingRound.investments.length > 0) {
            throw new BadRequestException("Cannot delete funding round with existing investments")
        }
        await this.fundingRoundRepository.remove(fundingRound);
    }

    private validateBaseConstraints(fundingRound: FundingRound, fundingRoundDto: CreateFundingRoundDto) {
        if (new Decimal(fundingRoundDto.fundingGoal).lessThan(new Decimal(fundingRound.fundingGoal))) {
            throw new BadRequestException("Cannot decrease funding goal of round with existing investments")
        }
        if (new Date(fundingRoundDto.startDate).getTime() !== (new Date(fundingRound.startDate)).getTime()) {
            throw new BadRequestException("Cannot change start date of round with existing investments")
        }
        if (new Date(fundingRoundDto.endDate).getTime() < (new Date(fundingRound.endDate)).getTime()) {
            throw new BadRequestException("Cannot shorten round with existing investments")
        }
    }
}
