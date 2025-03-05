import { Expose } from "class-transformer";

export class UpdateStartupDto {
    title: string;
    description: string;
    fundingGoal: string;
    teamExperience: string;
    // @Expose({ name: 'industry' })
    // industry: string;
    tamMarket: string;
    samMarket: string;
    somMarket: string;
    autoApproveInvestments: boolean;
    revenuePerYear: number[];
    capitalExpenditures: number[];
    changesInWorkingCapital: number[];
    deprecationAndAmortization: number[];


    constructor(
        title: string,
        description: string,
        fundingGoal: string,
        tam: string,
        sam: string,
        som: string,
        teamExperience: string,
        // industry: string,
        autoApproveInvestments: boolean,
        revenuePerYear: number[],
        capitalExpenditures: number[],
        changesInWorkingCapital: number[],
        deprecationAndAmortization: number[]
    ) {
        this.title = title;
        this.description = description;
        this.fundingGoal = fundingGoal;
        this.tamMarket = tam;
        this.samMarket = sam;
        this.somMarket = som;
        this.teamExperience = teamExperience;
        // this.industry = industry;
        this.autoApproveInvestments = autoApproveInvestments;
        this.revenuePerYear = revenuePerYear;
        this.capitalExpenditures = capitalExpenditures;
        this.changesInWorkingCapital = changesInWorkingCapital;
        this.deprecationAndAmortization = deprecationAndAmortization;
    }
}
