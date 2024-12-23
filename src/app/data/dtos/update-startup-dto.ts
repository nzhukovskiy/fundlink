import { Expose } from "class-transformer";

export class UpdateStartupDto {
    title: string;
    description: string;

    @Expose({ name: 'funding_goal' })
    fundingGoal: string;
    
    @Expose({ name: 'team_experience' })
    teamExperience: string;

    @Expose({ name: 'industry' })
    industry: string;

    tam: string;
    sam: string;
    som: string;

    @Expose({ name: 'capital_expenditures' })
    capitalExpenditures: number[];

    constructor(
        title: string,
        description: string,
        fundingGoal: string,
        tam: string,
        sam: string,
        som: string,
        teamExperience: string,
        industry: string,
        capitalExpenditures: number[]
    ) {
        this.title = title;
        this.description = description;
        this.fundingGoal = fundingGoal;
        this.tam = tam;
        this.sam = sam;
        this.som = som;
        this.teamExperience = teamExperience;
        this.industry = industry;
        this.capitalExpenditures = capitalExpenditures;
    }
}
