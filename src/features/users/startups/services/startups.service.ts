import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Startup } from "../entities/startup";
import { Repository } from "typeorm";
import { CreateStartupDto } from "../dtos/create-startup-dto";
import * as bcrypt from "bcrypt";
import { PaginateService } from "../../common/services/paginate/paginate.service";
import { PaginateQuery } from "nestjs-paginate";
import { UpdateStartupDto } from "../dtos/update-startup-dto";
import { FundingRoundsService } from "../../../investments/services/funding-rounds.service";
import { JwtTokenService } from "../../../token/services/jwt-token.service";
import { Investor } from "../../investors/entities/investor";
import { UsersService } from "../../services/users.service";
import { User } from "../../user/user";
import { Tag } from "../../../tags/entities/tag/tag";
import Decimal from "decimal.js";
import { sampleTime } from "rxjs";

@Injectable()
export class StartupsService {
    constructor(@InjectRepository(Startup) private readonly startupRepository: Repository<Startup>,
                @InjectRepository(Investor) private readonly investorRepository: Repository<Investor>,
                @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
                private readonly usersService: UsersService,
                private readonly jwtTokenService: JwtTokenService,
                private readonly paginateService: PaginateService,
                private readonly fundingRoundsService: FundingRoundsService) {
    }

    incomeTaxRate = "0.18";
    interestRate = "0.18";
    bonds10YearsYield = "0.16";
    beta = "1.3";
    stockMarketAverageReturn = "0.083";

    async getAll(query: PaginateQuery, title = "", tag = "", params = {}) {
        const startupsQuery = this.startupRepository.createQueryBuilder("startup")

        if (tag) {
            startupsQuery.leftJoin("startup.tags", "tag").where("tag.title = :tagTitle", {tagTitle: tag})
        }
        if (title) {
            startupsQuery.andWhere("to_tsvector('simple', startup.title) @@ plainto_tsquery('simple', :title)", { title });
        }

        return this.paginateService.paginate(query, startupsQuery,
          {
              ...params,
              relations: ["fundingRounds"]
          });
    }

    async getOne(id: number) {
        const startup = await this.startupRepository.createQueryBuilder('startup')
          .leftJoinAndSelect('startup.fundingRounds', 'fundingRound')
          .where('startup.id = :id', { id })
          .orderBy('fundingRound.startDate', 'ASC')
          .leftJoinAndSelect('startup.tags', 'tag')
          .where('startup.id = :id', { id })
          .getOne();
        if (!startup) {
            throw new NotFoundException(`Startup with an id ${id} does not exist`);
        }
        return {...startup, dcf: this.calculateDcf(startup)};
    }

    async getCurrent(userData: User) {
        return this.getOne(userData.id);
    }

    async create(createStartupDto: CreateStartupDto) {
        let startupDto = createStartupDto;
        if (await this.usersService.findByEmail(startupDto.email)) {
            throw new BadRequestException(`User with email ${startupDto.email} already exists`);
        }
        startupDto.password = await bcrypt.hash(startupDto.password, 10);
        let savedStartup = await this.startupRepository.save(startupDto);
        await this.fundingRoundsService.create(savedStartup.id, {
            fundingGoal: "10000",
            startDate: new Date(),
            endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        })
        let startup = await this.startupRepository.findOneBy({id: savedStartup.id});
        delete startup.password;
        startup["role"] = startup.getRole();
        return {
            accessToken: await this.jwtTokenService.generateToken(startup)
        }
    }

    async update(id: number, updateStartupDto: UpdateStartupDto) {
        let startup = await this.startupRepository.findOne({ where: {id: id} });
        if (!startup) {
            throw new NotFoundException(`Startup with an id ${id} does not exist`);
        }
        Object.assign(startup, updateStartupDto);
        if (!updateStartupDto.logoPath) {
            startup.logoPath = null;
        }
        return this.startupRepository.save(startup);
    }

    async getInvestors(id: number, fundingRoundId?: number) {
        let whereClause: string;
        if (fundingRoundId) {
            whereClause = 'startup.id = :id and fundingRound.id = :fundingRoundId';
        }
        else {
            whereClause = 'startup.id = :id';
        }
        return this.investorRepository.createQueryBuilder('investor')
            .innerJoin('investor.investments', 'investment')
            .innerJoin('investment.fundingRound', 'fundingRound')
            .innerJoin('fundingRound.startup', 'startup')
            .where(whereClause, { id, fundingRoundId })
            .select(['investor.id as id', 'investor.name as name', 'investor.surname as surname', 'investor.email as email',
                'SUM(investment.amount) AS "totalInvestment"'])
            .groupBy('investor.id')
            .addGroupBy('investor.name')
            .distinct(true)
            .getRawMany();
    }

    async uploadPresentation(startupId: number, fileName: string) {
        const startup = await this.startupRepository.findOneBy({id: startupId});
        if (!startup) {
            throw new NotFoundException('Startup with this id not found');
        }
        startup.presentationPath = fileName;
        return this.startupRepository.save(startup);
    }

    async assignTag(tagId: number, startupId: number) {
        let startup = await this.getOne(startupId);
        let tag = await this.tagRepository.findOneBy({id: tagId});
        console.log(startup);
        startup.tags.push(tag);
        return this.startupRepository.save(startup);
    }

    async removeTag(tagId: number, startupId: number) {
        let startup = await this.getOne(startupId);
        startup.tags = startup.tags.filter(tag => tag.id !== tagId);
        return this.startupRepository.save(startup);
    }

    calculateDcf(startup: Startup) {

        let dcf = new Decimal(0);
        if (!startup.revenuePerYear || !startup.capitalExpenditures
          || !startup.changesInWorkingCapital || !startup.deprecationAndAmortization) {
            return;
        }
        let totalInvestments = new Decimal("0");
        startup.fundingRounds.forEach(round => {
            totalInvestments = totalInvestments.plus(new Decimal(round.currentRaised));
        })
        console.log(totalInvestments);
        if (totalInvestments.equals(0)) {
            return dcf;
        }
        console.log(startup.revenuePerYear)
        startup.revenuePerYear.forEach((revenue, i) => {
            let fcf = new Decimal(revenue).mul(new Decimal("1")
              .minus(new Decimal(this.incomeTaxRate))).plus(new Decimal(startup.deprecationAndAmortization[i]))
              .minus(new Decimal(startup.capitalExpenditures[i])).minus(new Decimal(startup.changesInWorkingCapital[i]))
            dcf = dcf.plus(fcf.div((new Decimal(1).plus(this.calculateDiscountRate(startup, totalInvestments))).pow(new Decimal(i).plus(1))));
            console.log(this.calculateDiscountRate(startup, totalInvestments))
        })
        return dcf;
    }

    async uploadLogo(startupId: number, fileName: string) {
        const startup = await this.startupRepository.findOneBy({id: startupId});
        if (!startup) {
            throw new NotFoundException('Startup with this id not found');
        }
        startup.logoPath = fileName;
        return this.startupRepository.save(startup);
    }

    private calculateDiscountRate(startup: Startup, totalInvestments: Decimal) {
        let v = totalInvestments.plus(new Decimal(startup.debtAmount));
        let costOfEquity = new Decimal(this.bonds10YearsYield).plus(new Decimal(this.beta).mul((new Decimal(this.stockMarketAverageReturn).minus(new Decimal(this.bonds10YearsYield)))));
        return (totalInvestments.div(v).mul(costOfEquity)).plus((new Decimal(startup.debtAmount).div(v).mul(new Decimal(this.interestRate))).mul(new Decimal(1).minus(new Decimal(this.incomeTaxRate))));
    }


}
