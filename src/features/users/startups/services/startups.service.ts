import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Startup } from "../entities/startup.entity";
import { Repository } from "typeorm";
import { CreateStartupDto } from "../dtos/requests/create-startup-dto";
import * as bcrypt from "bcrypt";
import { PaginateQuery } from "nestjs-paginate";
import { UpdateStartupDto } from "../dtos/requests/update-startup-dto";
import { FundingRoundsService } from "../../../investments/services/funding-rounds.service";
import { JwtTokenService } from "../../../token/services/jwt-token.service";
import { Investor } from "../../investors/entities/investor";
import { UsersService } from "../../services/users.service";
import { User } from "../../user/user";
import { Tag } from "../../../tags/entities/tag/tag";
import Decimal from "decimal.js";
import { ExitStartupDto } from "../dtos/requests/exit-startup.dto";
import { ExitType } from "../../constants/exit-type";
import { StartupStage } from "../../constants/startup-stage";
import { ErrorCode } from "../../../../constants/error-code";
import { ValuationService } from "./valuation/valuation.service";
import { StartupsRepository } from "../repositories/startups/startups.repository";
import { InvestorsRepository } from "../../investors/repositories/investors/investors.repository";
import { Exit } from "../entities/exit";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Roles } from "../../constants/roles";
import { NotificationTypes } from "../../../notifications/constants/notification-types";

@Injectable()
export class StartupsService {
    constructor(
        @InjectRepository(Startup)
        private readonly startupRepository: Repository<Startup>,
        @InjectRepository(Investor)
        private readonly investorRepository: Repository<Investor>,
        @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
        @InjectRepository(Exit) private readonly exitRepository: Repository<Exit>,
        private readonly usersService: UsersService,
        private readonly jwtTokenService: JwtTokenService,
        private readonly fundingRoundsService: FundingRoundsService,
        private readonly valuationService: ValuationService,
        private readonly startupsRepository: StartupsRepository,
        private readonly investorsRepository: InvestorsRepository,
        private readonly eventEmitter2: EventEmitter2
    ) {}

    async getAll(
        query: PaginateQuery,
        title = "",
        tag = "",
        isInteresting = false,
        onlyActive = false,
        includeExited = false,
        investorId = -1,
        params = {}
    ) {
        return this.startupsRepository.getAll(
            query,
            title,
            tag,
            isInteresting,
            onlyActive,
            includeExited,
            investorId,
            params
        )
    }

    async getOne(id: number, includeInvestments = false, investorId?: number) {
        const startup = await this.startupsRepository.getOne(id, includeInvestments, investorId);
        if (!startup.raw.length) {
            throw new NotFoundException({
                errorCode: ErrorCode.STARTUP_WITH_ID_DOES_NOT_EXISTS,
                data: { id },
                message: `Startup with an id ${id} does not exist`,
            })
        }
        const startupEntity = startup.entities[0]

        const rawMap = startup.raw.map((raw) => ({
            startupId: raw["startup_id"],
            fundingRoundId: raw["fundingRound_id"],
            isUpdating: raw["isUpdating"],
        }))

        for (const fundingRound of startupEntity.fundingRounds) {
            const match = rawMap.find(
              (r) =>
                r.startupId === startupEntity.id &&
                r.fundingRoundId === fundingRound.id
            )
            if (match) {
                (fundingRound as any).isUpdating = match.isUpdating
            }
        }

        return {
            ...startupEntity,
            isInteresting: startup.raw[0].isInteresting,
            dcf: this.calculateDcf(startupEntity)
        }
    }

    async getCurrent(userData: User) {
        return this.getOne(userData.id, true)
    }

    async create(createStartupDto: CreateStartupDto) {
        const startupDto = createStartupDto
        if (await this.usersService.findByEmail(startupDto.email)) {
            throw new BadRequestException(
              {
                  errorCode: ErrorCode.USER_EMAIL_DUPLICATE,
                  data: {email: startupDto.email},
                  message: `User with email ${startupDto.email} already exists`
              }
            )
        }
        startupDto.password = await bcrypt.hash(startupDto.password, 10)
        const savedStartup = await this.startupRepository.save(startupDto)
        await this.fundingRoundsService.create(savedStartup.id, {
            fundingGoal: createStartupDto.initialFundingGoal,
            preMoney: createStartupDto.preMoney,
            startDate: new Date(),
            endDate: new Date(
                new Date().setFullYear(new Date().getFullYear() + 1)
            ),
        })
        const startup = await this.startupRepository.findOneBy({
            id: savedStartup.id,
        })
        return this.jwtTokenService.generateTokens(startup)
    }

    async update(id: number, updateStartupDto: UpdateStartupDto) {
        const startup = await this.startupRepository.findOne({
            where: { id: id },
        })
        if (!startup) {
            throw new NotFoundException(
                `Startup with an id ${id} does not exist`
            )
        }
        if (startup.stage !== StartupStage.ACTIVE) {
            throw new BadRequestException({
                errorCode: ErrorCode.CANNOT_UPDATE_EXITED_STARTUP,
                data: {id},
                message: "Cannot update the exited startup"
            })
        }
        Object.assign(startup, updateStartupDto)
        if (!updateStartupDto.logoPath) {
            startup.logoPath = null
        }
        return this.startupRepository.save(startup)
    }

    async getInvestors(id: number, fundingRoundId?: number) {
        const investors = await this.investorsRepository.getInvestorsForStartup(id, fundingRoundId);
        let whereClause: string
        if (fundingRoundId) {
            whereClause =
              "startup.id = :id and fundingRound.id = :fundingRoundId"
        } else {
            whereClause = "startup.id = :id"
        }
        const startup = await this.startupRepository.createQueryBuilder("startup")
          .leftJoin("startup.fundingRounds", "fundingRound")
          .where(whereClause, { id, fundingRoundId })
          .select(['startup.id as id',
              'SUM(fundingRound.preMoney) AS "preMoney"'])
          .groupBy("startup.id")
          .getRawOne()
        return {
            investors,
            startup
        }
    }

    async uploadPresentation(startupId: number, fileName: string) {
        const startup = await this.startupRepository.findOneBy({
            id: startupId,
        })
        if (!startup) {
            throw new NotFoundException("Startup with this id not found")
        }
        if (startup.stage !== StartupStage.ACTIVE) {
            throw new BadRequestException({
                errorCode: ErrorCode.CANNOT_UPDATE_EXITED_STARTUP,
                data: {id: startupId},
                message: "Cannot update the exited startup"
            })
        }
        startup.presentationPath = fileName
        return this.startupRepository.save(startup)
    }

    async assignTag(tagId: number, startupId: number) {
        const startup = await this.getOne(startupId)
        const tag = await this.tagRepository.findOneBy({ id: tagId })
        if (!tag) {
            throw new NotFoundException(`Tag with id ${tagId} not found`)
        }
        if (startup.stage !== StartupStage.ACTIVE) {
            throw new BadRequestException({
                errorCode: ErrorCode.CANNOT_UPDATE_EXITED_STARTUP,
                data: {id: startupId},
                message: "Cannot update the exited startup"
            })
        }
        if (!startup.tags.some((x) => x.id === tagId)) {
            startup.tags.push(tag)
        }
        return this.startupRepository.save(startup)
    }

    async removeTag(tagId: number, startupId: number) {
        const startup = await this.getOne(startupId)
        if (startup.stage !== StartupStage.ACTIVE) {
            throw new BadRequestException({
                errorCode: ErrorCode.CANNOT_UPDATE_EXITED_STARTUP,
                data: {id: startupId},
                message: "Cannot update the exited startup"
            })
        }
        startup.tags = startup.tags.filter((tag) => tag.id !== tagId)
        return this.startupRepository.save(startup)
    }

    calculateDcf(startup: Startup) {
        return this.valuationService.valuate(startup)
    }

    async uploadLogo(startupId: number, fileName: string) {
        const startup = await this.startupRepository.findOneBy({
            id: startupId,
        })
        if (!startup) {
            throw new NotFoundException("Startup with this id not found")
        }
        startup.logoPath = fileName
        return this.startupRepository.save(startup)
    }

    async markAsInteresting(startupId: number, investorId: number) {
        const startup = await this.startupRepository.findOneBy({
            id: startupId,
        })
        const investor = await this.investorRepository.findOne({
            where: { id: investorId },
            relations: ["interestingStartups"],
        })
        investor.interestingStartups.push(startup)
        return this.investorRepository.save(investor)
    }

    async removeFromInteresting(startupId: number, investorId: number) {
        const investor = await this.investorRepository.findOne({
            where: { id: investorId },
            relations: ["interestingStartups"],
        })
        investor.interestingStartups = investor.interestingStartups.filter(
            (x) => x.id !== startupId
        )
        return this.investorRepository.save(investor)
    }

    async exitStartup(startupId: number, exitStartupDto: ExitStartupDto) {
        const startup = await this.startupRepository
          .createQueryBuilder("startup")
          .leftJoinAndSelect("startup.fundingRounds", "fundingRound")
          .leftJoinAndSelect("fundingRound.investments", "investment")
          .where("startup.id = :id", {id: startupId})
          .getOne()
        if (startup.exit) {
            throw new BadRequestException("Startup already exited")
        }
        if (exitStartupDto.type === ExitType.BANKRUPT) {
            exitStartupDto.value = "0"
        } else if (!exitStartupDto.value) {
            throw new BadRequestException("Exit value must be provided")
        }
        const investors = (await this.getInvestors(startup.id)).investors

        const startupShare = await this.startupsRepository.calculateStartupsShare(startup.id);
        console.log("startup share", startupShare)
        const startupResult = new Decimal(exitStartupDto.value)
          .mul(new Decimal(startupShare))

        const exit = this.exitRepository.create(exitStartupDto)
        if (exitStartupDto.type === ExitType.IPO) {
            exit.sharePrice = new Decimal(exitStartupDto.value).div(new Decimal(exitStartupDto.totalShares)).toString()
        }

        startup.stage = StartupStage.EXITED
        startup.exit = exit
        const savedStartup = await this.startupRepository.save(startup)

        this.eventEmitter2.emit("notification", {
            userId: savedStartup.id,
            userType: Roles.STARTUP,
            type: NotificationTypes.STARTUP_EXIT,
            text: `Вы совершили экзит по сценарию ${savedStartup.exit.type}`,
            exit: savedStartup.exit,
            exitInvestorShare: startupResult.toString(),
            exitInvestorShareNumber: (new Decimal(exitStartupDto.totalShares).mul(new Decimal(startupShare))).toString()
        })

        console.log(`RESULT STARTUP ${startup.id} SHARE ${startupResult}`)
        for (const investor of investors) {
            const share = await this.startupsRepository.calculateInvestorShareWithStartupShare(investor.id, startup.id)
            console.log("total share", investor.id, startup.id, share)
            // const share = await this.calculateInvestorShareForStartup(
            //     investor.id,
            //     savedStartup.id
            // )
            let exitInvestorShareNumber: null | Decimal
            let investorResult = new Decimal(0)
            if (exitStartupDto.type === ExitType.ACQUIRED) {
                investorResult = new Decimal(exitStartupDto.value)
                  .mul(new Decimal(share))
                console.log(`RESULT INVESTOR ${investor.id} SHARE ${investorResult}`)

            }
            else {
                exitInvestorShareNumber = new Decimal(exitStartupDto.totalShares).mul(new Decimal(share))
                investorResult = exitInvestorShareNumber.mul(exit.sharePrice)
                console.log(`IPO RESULT INVESTOR ${investor.id} SHARE ${investorResult}`)

            }
            this.eventEmitter2.emit("notification", {
                userId: investor.id,
                userType: Roles.INVESTOR,
                type: NotificationTypes.STARTUP_EXIT,
                text: `Стартап ${savedStartup.title} совершил экзит по сценарию ${savedStartup.exit.type}`,
                exit: savedStartup.exit,
                exitInvestorShare: investorResult.toString(),
                exitInvestorShareNumber: exitInvestorShareNumber ? exitInvestorShareNumber.toString() : null
            })


        }

        return this.getOne(startupId, true)
    }

    private async exitAcquired(startup: Startup, exitStartupDto: ExitStartupDto) {

    }

    private async exitIPO(startup: Startup, exitStartupDto: ExitStartupDto) {

    }
    private calculateInvestorShareForStartup(
        investorId: number,
        startupId: number
    ) {
        return this.startupsRepository.calculateInvestorShareForStartup(investorId, startupId)
    }
}
