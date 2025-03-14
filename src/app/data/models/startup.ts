import {FundingRound} from "./funding-round";
import {Tag} from "./tag";
import {User} from "./user";
import {Expose, Type, plainToInstance} from 'class-transformer';


export class Startup extends User {
    constructor(
        title: string,
        description: string,
        fundingGoal: string,
        presentationPath: string,
        logoPath: string,
        autoApproveInvestments: boolean,
        fundingRounds: FundingRound[],
        id: number, email: string, password: string,
        tam: string, sam: string, som: string,
        teamExperience: string, industry: string,
        tags: Tag[],
        dcf: string,
        revenuePerYear: number[],
        capitalExpenditures: number[],
        changesInWorkingCapital: number[],
        deprecationAndAmortization: number[],
        totalInvestment: string,
        sharePercentage: string,
        totalInvestmentForStartup: string
    ) {
        super(id, email, password);
        this.title = title;
        this.description = description;
        this.fundingGoal = fundingGoal;
        this.presentationPath = presentationPath;
        this.logoPath = logoPath;
        this.autoApproveInvestments = autoApproveInvestments;
        this.fundingRounds = fundingRounds;
        this.tamMarket = tam;
        this.samMarket = sam;
        this.somMarket = som;
        this.teamExperience = teamExperience;
        this.industry = industry;
        this.tags = tags;
        this.dcf = dcf;
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

    @Expose({name: 'revenue_per_year'})
    revenuePerYear: number[];

    @Expose({name: 'capital_expenditures'})
    capitalExpenditures: number[];

    @Expose({name: 'changes_in_working_capital'})
    changesInWorkingCapital: number[];

    @Expose({name: 'deprecation_and_amortization'})
    deprecationAndAmortization: number[];
}
