import {FundingRound} from "./funding-round";
import {Tag} from "./tag";
import {User} from "./user";
import { DcfDetailedDto } from '../dtos/responses/dcf-calculation-details';
import {StartupStage} from "../../constants/startup-stage";
import {Exit} from "./exit";


export class Startup extends User {


    constructor(id: number, email: string, password: string, title: string, description: string, fundingGoal: string, presentationPath: string, logoPath: string, autoApproveInvestments: boolean, teamExperience: string, industry: string, tamMarket: string, samMarket: string, somMarket: string, fundingRounds: FundingRound[], tags: Tag[], dcf: DcfDetailedDto, isInteresting: boolean, investmentsTotal: number, revenuePerYear: number[], capitalExpenditures: number[], changesInWorkingCapital: number[], deprecationAndAmortization: number[], stage: StartupStage, joinedAt: Date, exit: Exit) {
        super(id, email, password);
        this.title = title;
        this.description = description;
        this.fundingGoal = fundingGoal;
        this.presentationPath = presentationPath;
        this.logoPath = logoPath;
        this.autoApproveInvestments = autoApproveInvestments;
        this.teamExperience = teamExperience;
        this.industry = industry;
        this.tamMarket = tamMarket;
        this.samMarket = samMarket;
        this.somMarket = somMarket;
        this.fundingRounds = fundingRounds;
        this.tags = tags;
        this.dcf = dcf;
        this.isInteresting = isInteresting;
        this.investmentsTotal = investmentsTotal;
        this.revenuePerYear = revenuePerYear;
        this.capitalExpenditures = capitalExpenditures;
        this.changesInWorkingCapital = changesInWorkingCapital;
        this.deprecationAndAmortization = deprecationAndAmortization;
        this.stage = stage;
        this.joinedAt = joinedAt;
        this.exit = exit;
    }

    title: string;

    description: string;

    fundingGoal: string;

    presentationPath: string;

    logoPath: string;

    autoApproveInvestments: boolean;

    teamExperience: string;

    industry: string;

    tamMarket: string;

    samMarket: string;

    somMarket: string;

    fundingRounds: FundingRound[];

    tags: Tag[];

    dcf: DcfDetailedDto

    isInteresting: boolean

    investmentsTotal: number

    revenuePerYear: number[];

    capitalExpenditures: number[];

    changesInWorkingCapital: number[];

    deprecationAndAmortization: number[];

    stage: StartupStage;

    joinedAt: Date;

    exit: Exit;
}
