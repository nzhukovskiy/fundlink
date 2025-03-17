import {FundingRound} from "./funding-round";
import {Tag} from "./tag";
import {User} from "./user";
import {Expose, Type, plainToInstance} from 'class-transformer';


export class Startup extends User {


    constructor(id: number, email: string, password: string, title: string, description: string, fundingGoal: string, presentationPath: string, logoPath: string, autoApproveInvestments: boolean, teamExperience: string, industry: string, tamMarket: string, samMarket: string, somMarket: string, fundingRounds: FundingRound[], tags: Tag[], dcf: string, isInteresting: boolean, revenuePerYear: number[], capitalExpenditures: number[], changesInWorkingCapital: number[], deprecationAndAmortization: number[]) {
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
        this.revenuePerYear = revenuePerYear;
        this.capitalExpenditures = capitalExpenditures;
        this.changesInWorkingCapital = changesInWorkingCapital;
        this.deprecationAndAmortization = deprecationAndAmortization;
    }

    title: string;

    description: string;

    @Expose({name: 'funding_goal'})
    fundingGoal: string;

    @Expose({name: 'presentation_path'})
    presentationPath: string;

    @Expose({name: 'presentation_path'})
    logoPath: string;

    autoApproveInvestments: boolean;

    @Expose({name: 'team_experience'})
    teamExperience: string;

    industry: string;

    tamMarket: string;

    samMarket: string;

    somMarket: string;

    @Expose({name: 'funding_rounds'})
    @Type(() => FundingRound)
    fundingRounds: FundingRound[];

    tags: Tag[];

    dcf: string

    isInteresting: boolean

    @Expose({name: 'revenue_per_year'})
    revenuePerYear: number[];

    @Expose({name: 'capital_expenditures'})
    capitalExpenditures: number[];

    @Expose({name: 'changes_in_working_capital'})
    changesInWorkingCapital: number[];

    @Expose({name: 'deprecation_and_amortization'})
    deprecationAndAmortization: number[];
}
