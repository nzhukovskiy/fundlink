import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { Startup } from "../entities/startup";
import { DataSource, Repository } from "typeorm";
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
import { PaginateService } from "../../../../common/paginate/services/paginate/paginate.service";
import { DcfDetailedDto } from "../dtos/responses/dcf-detailed.dto/dcf-detailed.dto";
import { WaccDetailsDto } from "../dtos/responses/wacc-details.dto/wacc-details.dto";
import { FundingRound } from "../../../investments/entities/funding-round/funding-round";

@Injectable()
export class StartupsService {
    constructor(
      @InjectRepository(Startup)
      private readonly startupRepository: Repository<Startup>,
      @InjectRepository(Investor)
      private readonly investorRepository: Repository<Investor>,
      @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
      @InjectRepository(FundingRound) private readonly fundingRoundRepository: Repository<FundingRound>,
      private readonly usersService: UsersService,
      private readonly jwtTokenService: JwtTokenService,
      private readonly paginateService: PaginateService,
      private readonly fundingRoundsService: FundingRoundsService,
      @InjectDataSource()
      private dataSource: DataSource
    ) {
    }

    incomeTaxRate = "0.18";
    interestRate = "0.18";
    bonds10YearsYield = "0.16";
    beta = "1.3";
    stockMarketAverageReturn = "0.083";

    async getAll(
      query: PaginateQuery,
      title = "",
      tag = "",
      isInteresting = false,
      onlyActive = false,
      investorId = -1,
      params = {}
    ) {
        const startupsQuery =
          this.startupRepository.createQueryBuilder("startup")
            .leftJoinAndSelect("startup.fundingRounds", "fundingRound");

        if (tag) {
            startupsQuery
              .leftJoin("startup.tags", "tag")
              .where("tag.title = :tagTitle", { tagTitle: tag });
        }
        if (title) {
            startupsQuery.andWhere("startup.title ILIKE :title", {
                title: `%${title}%`
            });
        }
        if (isInteresting) {
            startupsQuery
              .andWhere(
                `
            EXISTS (
                SELECT 1 
                FROM investor_interesting_startups_startup iiss  
                WHERE iiss."startupId"  = startup.id and iiss."investorId" = :investorId
            )`
              )
              .setParameter("investorId", investorId);
        }
        if (onlyActive) {
            startupsQuery
              .andWhere(
                `
            EXISTS (
                SELECT 1 
                FROM funding_round fr
                WHERE fr."startupId" = startup.id and fr."isCurrent" = true
            )`
              );
        }

        return this.paginateService.paginate(query, startupsQuery, {
            ...params
            // relations: ["fundingRounds"],
        });
    }

    async getOne(id: number, includeInvestments = false, investorId?: number) {
        let startupQuery = this.startupRepository
          .createQueryBuilder("startup")
          .leftJoinAndSelect("startup.fundingRounds", "fundingRound");
        if (includeInvestments) {
            startupQuery = startupQuery
              .leftJoinAndSelect("fundingRound.investments", "investment")
              .addSelect(`
            EXISTS (
                SELECT 1 
                FROM funding_round_change_proposal frcp  
                WHERE frcp."fundingRoundId"  = "fundingRound".id and frcp.status = 'pending_review'
            )`,
                "isUpdating")
              .leftJoinAndSelect("investment.investor", "investor");
        }
        if (investorId) {
            startupQuery = startupQuery
              .addSelect(
                `
            EXISTS (
                SELECT 1 
                FROM investor_interesting_startups_startup iiss  
                WHERE iiss."startupId"  = startup.id and iiss."investorId" = :investorId
            )`,
                "isInteresting"
              )
              .setParameter("investorId", investorId);
        }
        const startup = await startupQuery
          .where("startup.id = :id", { id })
          .orderBy("fundingRound.startDate", "ASC")
          .leftJoinAndSelect("startup.tags", "tag")
          .where("startup.id = :id", { id })
          .getRawAndEntities();

        if (!startup) {
            throw new NotFoundException(
              `Startup with an id ${id} does not exist`
            );
        }
        const startupEntity = startup.entities[0];

        const rawMap = startup.raw.map((raw) => ({
            startupId: raw["startup_id"],
            fundingRoundId: raw["fundingRound_id"],
            isUpdating: raw["isUpdating"]
        }));

        for (const fundingRound of startupEntity.fundingRounds) {
            const match = rawMap.find(
              (r) => r.startupId === startupEntity.id && r.fundingRoundId === fundingRound.id
            );
            if (match) {
                (fundingRound as any).isUpdating = match.isUpdating;
            }
        }

        return {
            ...startupEntity,
            isInteresting: startup.raw[0].isInteresting,
            dcf: this.calculateDcf(startup.entities[0])
        };
    }

    async getCurrent(userData: User) {
        return this.getOne(userData.id, true);
    }

    async create(createStartupDto: CreateStartupDto) {
        const startupDto = createStartupDto;
        if (await this.usersService.findByEmail(startupDto.email)) {
            throw new BadRequestException(
              `User with email ${startupDto.email} already exists`
            );
        }
        startupDto.password = await bcrypt.hash(startupDto.password, 10);
        const savedStartup = await this.startupRepository.save(startupDto);
        await this.fundingRoundsService.create(savedStartup.id, {
            fundingGoal: createStartupDto.initialFundingGoal,
            startDate: new Date(),
            endDate: new Date(
              new Date().setFullYear(new Date().getFullYear() + 1)
            )
        });
        const startup = await this.startupRepository.findOneBy({
            id: savedStartup.id
        });
        delete startup.password;
        startup["role"] = startup.getRole();
        return {
            accessToken: await this.jwtTokenService.generateToken(startup)
        };
    }

    async update(id: number, updateStartupDto: UpdateStartupDto) {
        const startup = await this.startupRepository.findOne({
            where: { id: id }
        });
        if (!startup) {
            throw new NotFoundException(
              `Startup with an id ${id} does not exist`
            );
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
            whereClause =
              "startup.id = :id and fundingRound.id = :fundingRoundId";
        } else {
            whereClause = "startup.id = :id";
        }
        return this.investorRepository
          .createQueryBuilder("investor")
          .innerJoin("investor.investments", "investment")
          .innerJoin("investment.fundingRound", "fundingRound")
          .innerJoin("fundingRound.startup", "startup")
          .where(whereClause, { id, fundingRoundId })
          .andWhere("investment.stage = 'completed'")
          .select([
              "investor.id as id",
              "investor.name as name",
              "investor.surname as surname",
              "investor.email as email",
              "SUM(investment.amount) AS \"totalInvestment\""
          ])
          .groupBy("investor.id")
          .addGroupBy("investor.name")
          .distinct(true)
          .getRawMany();
    }

    async uploadPresentation(startupId: number, fileName: string) {
        const startup = await this.startupRepository.findOneBy({
            id: startupId
        });
        if (!startup) {
            throw new NotFoundException("Startup with this id not found");
        }
        startup.presentationPath = fileName;
        return this.startupRepository.save(startup);
    }

    async assignTag(tagId: number, startupId: number) {
        const startup = await this.getOne(startupId);
        const tag = await this.tagRepository.findOneBy({ id: tagId });
        if (!tag) {
            throw new NotFoundException(`Tag with id ${tagId} not found`);
        }
        if (!startup.tags.some((x) => x.id === tagId)) {
            startup.tags.push(tag);
        }
        return this.startupRepository.save(startup);
    }

    async removeTag(tagId: number, startupId: number) {
        const startup = await this.getOne(startupId);
        startup.tags = startup.tags.filter((tag) => tag.id !== tagId);
        return this.startupRepository.save(startup);
    }

    calculateDcf(startup: Startup) {
        let dcf = new Decimal(0);
        if (
          !startup.revenuePerYear ||
          !startup.capitalExpenditures ||
          !startup.changesInWorkingCapital ||
          !startup.deprecationAndAmortization
        ) {
            return;
        }
        let totalInvestments = new Decimal("0");
        startup.fundingRounds.forEach((round) => {
            totalInvestments = totalInvestments.plus(
              new Decimal(round.currentRaised)
            );
        });
        if (totalInvestments.equals(0)) {
            return dcf;
        }
        const calculationResult: Partial<DcfDetailedDto> = {
            inputs: {
                ebitPerYear: startup.revenuePerYear.map(x => parseFloat(x)),
                capitalExpenditures: startup.capitalExpenditures.map(x => parseFloat(x)),
                changesInWorkingCapital: startup.changesInWorkingCapital.map(x => parseFloat(x)),
                deprecationAndAmortization: startup.deprecationAndAmortization.map(x => parseFloat(x)),
                incomeTaxRate: parseFloat(this.incomeTaxRate),
                perpetualGrowthRate: 0.02,
                waccInputs: {
                    bonds10YearsYield: parseFloat(this.bonds10YearsYield),
                    beta: parseFloat(this.beta),
                    stockMarketAverageReturn: parseFloat(this.stockMarketAverageReturn),
                    interestRate: parseFloat(this.interestRate),
                    debtAmount: parseFloat(startup.debtAmount),
                    totalInvestments: totalInvestments.toNumber()
                }
            },
            fcfCalculations: [],
            warnings: []
        };
        const waccResults = this.calculateDiscountRate(
          startup,
          totalInvestments
        );
        calculationResult.waccCalculation = waccResults;
        const discountRate = new Decimal(waccResults.calculatedWacc);
        let finalYearFCF: Decimal | null = null;
        startup.revenuePerYear.forEach((revenue, i) => {
            const nopat = new Decimal(revenue)
              .mul(new Decimal("1").minus(new Decimal(this.incomeTaxRate)));
            const fcf = nopat
              .plus(new Decimal(startup.deprecationAndAmortization[i]))
              .minus(new Decimal(startup.capitalExpenditures[i]))
              .minus(new Decimal(startup.changesInWorkingCapital[i]));

            if (i === startup.revenuePerYear.length - 1) {
                finalYearFCF = fcf;
            }
            const discountFactor = new Decimal(1).plus(discountRate).pow(i + 1);
            const pvFcf = fcf.div(
              discountFactor
            );
            dcf = dcf.plus(pvFcf);


            calculationResult.fcfCalculations.push({
                year: i + 1,
                ebit: parseInt(revenue),
                nopat: nopat.toNumber(),
                fcf: fcf.toNumber(),
                discountFactor: discountFactor.toNumber(),
                pvFcf: pvFcf.toNumber()
            });
        });

        calculationResult.pvForecastFcfsTotal = dcf.toNumber();
        const g = new Decimal(0.02);

        const fcfNPlus1 = finalYearFCF.mul(new Decimal(1).plus(g));


        const tvDenominator = discountRate.minus(g);
        if (tvDenominator.isZero() || tvDenominator.isNegative()) {
            console.error(
              `WACC (${discountRate}) minus Growth Rate (${g}) is non-positive (${tvDenominator}). Cannot calculate Terminal Value.`
            );
            return null;
        }
        const terminalValue = fcfNPlus1.div(tvDenominator);


        const tvDiscountFactor = new Decimal(1)
          .plus(discountRate)
          .pow(startup.deprecationAndAmortization.length);

        if (tvDiscountFactor.isZero()) {
            console.error(
              `Terminal Value discount factor is zero. Cannot calculate PV(TV).`
            );
            return null;
        }
        const pvTerminalValue = terminalValue.div(tvDiscountFactor);
        const terminalValueRaw = fcfNPlus1.div(tvDenominator);
        calculationResult.terminalValueCalculation = {
            finalYearFcf: finalYearFCF.toNumber(),
            fcfNPlus1: fcfNPlus1.toNumber(),
            terminalValueRaw: terminalValueRaw.toNumber(),
            tvDiscountFactor: new Decimal(1).div(tvDiscountFactor).toNumber(),
            pvTerminalValue: pvTerminalValue.toNumber()
        };
        calculationResult.totalDcfValue = dcf.plus(pvTerminalValue).toNumber();
        return calculationResult;
    }

    async uploadLogo(startupId: number, fileName: string) {
        const startup = await this.startupRepository.findOneBy({
            id: startupId
        });
        if (!startup) {
            throw new NotFoundException("Startup with this id not found");
        }
        startup.logoPath = fileName;
        return this.startupRepository.save(startup);
    }

    async markAsInteresting(startupId: number, investorId: number) {
        const startup = await this.startupRepository.findOneBy({
            id: startupId
        });
        const investor = await this.investorRepository.findOne({
            where: { id: investorId },
            relations: ["interestingStartups"]
        });
        investor.interestingStartups.push(startup);
        return this.investorRepository.save(investor);
    }

    async removeFromInteresting(startupId: number, investorId: number) {
        const investor = await this.investorRepository.findOne({
            where: { id: investorId },
            relations: ["interestingStartups"]
        });
        investor.interestingStartups = investor.interestingStartups.filter(
          (x) => x.id !== startupId
        );
        return this.investorRepository.save(investor);
    }

    async getMostPopularStartups() {
        const recentInvestmentsSubQuery = this.fundingRoundRepository
          .createQueryBuilder("fundingRound")
          .select(`SUM(i.amount) as investments_amount`)
          .leftJoin("fundingRound.investments", "i")
          .where("\"fundingRound\".\"startupId\" = startup.id and \"i\".stage='completed' and \"i\".\"date\" >  CURRENT_DATE - interval '30 days'")
          .getQuery();

        const totalInvestmentsSubQuery = this.fundingRoundRepository
          .createQueryBuilder("fundingRound")
          .select(`SUM(i.amount) as total_investments`)
          .leftJoin("fundingRound.investments", "i")
          .where("\"fundingRound\".\"startupId\" = startup.id and \"i\".stage='completed'")
          .getQuery();

        const uniqueInvestorsSubQuery = this.fundingRoundRepository
          .createQueryBuilder("fundingRound")
          .select(`COUNT(DISTINCT(investor.id)) as investors_count`)
          .leftJoin("fundingRound.investments", "investment")
          .leftJoin("investment.investor", "investor")
          .where("\"fundingRound\".\"startupId\" = startup.id and \"investment\".stage='completed'")
          .getQuery();

        const interestingCountSubQuery = this.dataSource
          .createQueryBuilder()
          .select(`COUNT(DISTINCT(iiss."investorId")) as investors_count`)
          .from("investor_interesting_startups_startup", "iiss")
          .where("iiss.\"startupId\" = startup.id")
          .getQuery();

        const startups = await this.startupRepository
          .createQueryBuilder("startup")
          .leftJoinAndSelect("startup.fundingRounds", "fundingRound")
          .addSelect(`(${recentInvestmentsSubQuery})`, "recentInvestmentsTotal")
          .addSelect(`(${totalInvestmentsSubQuery})`, "investmentsTotal")
          .addSelect(`(${uniqueInvestorsSubQuery})`, "uniqueInvestors")
          .addSelect(`(${interestingCountSubQuery})`, "interestingCount")
          .take(5)
          .getRawAndEntities();

        const rawMap = new Map<number, any>();
        startups.raw.forEach((row) => {
            rawMap.set(row.startup_id, row);
        });
        const mappedStartups = startups.entities.map((x, i) => {
            const raw = rawMap.get(x.id);
            return {
                ...x,
                investmentsTotal: parseFloat(raw?.investmentsTotal || 0),
                recentInvestmentsTotal: parseFloat(raw?.recentInvestmentsTotal || 0),
                uniqueInvestors: parseInt(raw?.uniqueInvestors || 0, 10),
                interestingCount: parseInt(raw?.interestingCount || 0, 10)
            };
        });
        const startupResults = Map<number, number>;
        const minTotalInvestment = Math.min(...mappedStartups.map(x => x.investmentsTotal as number));
        const maxTotalInvestment = Math.max(...mappedStartups.map(x => x.investmentsTotal as number));
        const minRecentInvestment = Math.min(...mappedStartups.map(x => x.recentInvestmentsTotal as number));
        const maxRecentInvestment = Math.max(...mappedStartups.map(x => x.recentInvestmentsTotal as number));
        const minUniqueInvestors = Math.min(...mappedStartups.map(x => x.uniqueInvestors as number));
        const maxUniqueInvestors = Math.max(...mappedStartups.map(x => x.uniqueInvestors as number));
        const minInterestingCount = Math.min(...mappedStartups.map(x => x.interestingCount as number));
        const maxInterestingCount = Math.max(...mappedStartups.map(x => x.interestingCount as number));

        for (const startup of mappedStartups) {
            const recentScore = (startup.recentInvestmentsTotal - minRecentInvestment) / (maxRecentInvestment - minRecentInvestment) * 100;
            const totalScore = (startup.investmentsTotal - minTotalInvestment) / (maxTotalInvestment - minTotalInvestment) * 100;
            const investorsScore = (startup.uniqueInvestors - minUniqueInvestors) / (maxUniqueInvestors - minUniqueInvestors) * 100;
            const interestingScore = (startup.interestingCount - minInterestingCount) / (maxInterestingCount - minInterestingCount) * 100;
            startupResults[startup.id] = recentScore * 0.4 + totalScore * 0.2 + investorsScore * 0.25 + interestingScore * 0.15;
        }
        return mappedStartups.sort((a, b) => -(startupResults[a.id] - startupResults[b.id]));
    }

    async getMostFundedStartups() {
        const totalInvestmentsSubQuery = this.fundingRoundRepository
          .createQueryBuilder("fundingRound")
          .select(`COALESCE(SUM(i.amount), 0) as total_investments`)
          .leftJoin("fundingRound.investments", "i")
          .where("\"fundingRound\".\"startupId\" = startup.id and \"i\".stage='completed'")
          .getQuery();

        const startupsRawAndEntities = await this.startupRepository
          .createQueryBuilder("startup")
          .leftJoinAndSelect("startup.fundingRounds", "fundingRound")
          .addSelect(`(${totalInvestmentsSubQuery})`, "investmentsTotal")
          .take(5)
          .getRawAndEntities();

        const aggregatedMap: Record<string, number> = {};
        startupsRawAndEntities.raw.forEach(raw => {
            aggregatedMap[raw.startup_id] = Number(raw.investmentsTotal);
        });

        return startupsRawAndEntities.entities.map(startup => (
          {
              ...startup,
              investmentsTotal: aggregatedMap[startup.id] || 0
          }
        )).sort((a, b) => b.investmentsTotal - a.investmentsTotal)
    }

    getStartupsNumber() {
        return this.startupRepository.createQueryBuilder("startup").getCount();
    }

    getRecentlyJoinedNumber() {
        return this.startupRepository
          .createQueryBuilder("startup")
          .where(`startup."joinedAt" >  CURRENT_DATE - interval '30 days'`)
          .getCount();
    }

    private calculateDiscountRate(startup: Startup, totalInvestments: Decimal) {
        const waccResult: Partial<WaccDetailsDto> = {};
        const v = totalInvestments.plus(new Decimal(startup.debtAmount));
        const costOfEquity = new Decimal(this.bonds10YearsYield).plus(
          new Decimal(this.beta).mul(
            new Decimal(this.stockMarketAverageReturn).minus(
              new Decimal(this.bonds10YearsYield)
            )
          )
        );
        waccResult.costOfEquity = costOfEquity.toNumber();
        const e = totalInvestments.div(v);
        waccResult.costOfDebtPreTax = parseFloat(this.interestRate);
        const kd = (new Decimal(this.interestRate)).mul(new Decimal(1).minus(new Decimal(this.incomeTaxRate)));
        waccResult.costOfDebtAfterTax = kd.toNumber();
        waccResult.equityValue = totalInvestments.toNumber();
        waccResult.debtValue = parseFloat(startup.debtAmount);
        waccResult.equityWeight = e.toNumber();
        const d = new Decimal(startup.debtAmount).div(v);
        waccResult.debtWeight = d.toNumber();
        waccResult.totalCapitalValue = v.toNumber();
        const result = e.mul(costOfEquity).plus(
          d
            .mul(new Decimal(this.interestRate))
            .mul(new Decimal(1).minus(new Decimal(this.incomeTaxRate)))
        );
        waccResult.calculatedWacc = result.toNumber();
        return {
            costOfEquity: costOfEquity.toNumber(),
            costOfDebtPreTax: parseFloat(this.interestRate),
            costOfDebtAfterTax: kd.toNumber(),
            equityValue: totalInvestments.toNumber(),
            debtValue: parseFloat(startup.debtAmount),
            equityWeight: e.toNumber(),
            debtWeight: d.toNumber(),
            totalCapitalValue: v.toNumber(),
            calculatedWacc: result.toNumber()
        } as WaccDetailsDto;
    }
}
