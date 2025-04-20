import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common"
import { CreateInvestmentDto } from "../dtos/create-investment-dto"
import { User } from "../../users/user/user"
import { InjectRepository } from "@nestjs/typeorm"
import { Investment } from "../entities/investment/investment"
import { Repository } from "typeorm"
import { FundingRoundsService } from "./funding-rounds.service"
import { Investor } from "../../users/investors/entities/investor"
import { Startup } from "../../users/startups/entities/startup"
import { InvestmentStage } from "../constants/investment-stage"
import { InvestmentApprovalType } from "../constants/investment-approval-type"
import { EventEmitter2 } from "@nestjs/event-emitter"
import { Roles } from "../../users/constants/roles"
import { CreateNotificationDto } from "../../notifications/entities/dtos/create-notification.dto"
import { NotificationTypes } from "../../notifications/constants/notification-types"
import Decimal from "decimal.js";
import { StartupStage } from "../../users/constants/startup-stage";

@Injectable()
export class InvestmentService {
    constructor(@InjectRepository(Investment) private readonly investmentRepository: Repository<Investment>,
                @InjectRepository(Investor) private readonly investorRepository: Repository<Investor>,
                @InjectRepository(Startup) private readonly startupRepository: Repository<Startup>,
                private readonly fundingRoundsService: FundingRoundsService,
                private eventEmitter: EventEmitter2) {
    }
    async create(fundingRoundId: number, createInvestmentDto: CreateInvestmentDto, investorData: User) {
        if (new Decimal(createInvestmentDto.amount).cmp(0) <= 0) {
            throw new BadRequestException("Invalid investment amount");
        }
        let fundingRound = await this.fundingRoundsService.getOne(fundingRoundId);
        if (!fundingRound.isCurrent) {
            throw new BadRequestException("Cannot invest in rounds that are not current");
        }
        if (fundingRound.startup.stage !== StartupStage.ACTIVE) {
            throw new BadRequestException("Cannot create funding round for a startup which have already exited");
        }
        let investor = await this.investorRepository.findOneBy({id: investorData.id});
        const stage = fundingRound.startup.autoApproveInvestments ? InvestmentStage.COMPLETED : InvestmentStage.PENDING_REVIEW;
        const approvalType = fundingRound.startup.autoApproveInvestments ? InvestmentApprovalType.AUTO_APPROVE : InvestmentApprovalType.STARTUP_APPROVE;
        let investment = this.investmentRepository.create({
            amount: createInvestmentDto.amount,
            investor: investor,
            fundingRound: fundingRound,
            stage: stage,
            approvalType: approvalType,
        })
        await this.investmentRepository.save(investment);
        fundingRound.investments.push(investment);
        await this.investmentRepository.save(fundingRound.investments);
        if (fundingRound.startup.autoApproveInvestments) {
            await this.fundingRoundsService.addFunds(fundingRound, investment.amount);
        }
        this.eventEmitter.emit('notification', {
            userId: fundingRound.startup.id,
            userType: Roles.STARTUP,
            type: NotificationTypes.INVESTMENT,
            text: `Investor ${investor.name} invested money in you`,
            investment: investment
        } as CreateNotificationDto);
        return investment;
    }

    async approveInvestment(investmentId: number, startupId: number) {
        const investment = await this.getInvestment(investmentId, startupId);
        if (investment.stage === InvestmentStage.PENDING_REVIEW) {
            investment.stage = InvestmentStage.COMMITTED;
            await this.fundingRoundsService.addFunds(investment.fundingRound, investment.amount)
            investment.stage = InvestmentStage.COMPLETED;
            await this.investmentRepository.save(investment);
        }
        return investment;
    }

    async rejectInvestment(investmentId: number, startupId: number) {
        const investment = await this.getInvestment(investmentId, startupId);
        if (investment.stage === InvestmentStage.PENDING_REVIEW) {
            investment.stage = InvestmentStage.REJECTED;
            await this.investmentRepository.save(investment);
        }
        return investment;
    }

    getTotalInvestments() {
        return this.investmentRepository.createQueryBuilder("investment")
          .select('sum(investment.amount) as "totalInvestments"')
          .where("investment.stage = 'completed'")
          .getRawOne()
    }

    private async getInvestment(investmentId: number, startupId: number) {
        const investment = await this.investmentRepository.findOne({
            where: {
                id: investmentId
            },
            relations: ["fundingRound", "fundingRound.startup"]
        })
        if (investment.fundingRound.startup.id !== startupId) {
            throw new UnauthorizedException("Not allowed to perform the action")
        }
        return investment;
    }
}
