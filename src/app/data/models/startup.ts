import { FundingRound } from "./funding-round";
import { Tag } from "./tag";
import { User } from "./user";
import { Expose, Type, plainToInstance } from 'class-transformer';


export class Startup extends User {
    constructor(
        title: string,
        description: string,
        fundingGoal: string,
        presentationPath: string,
        fundingRounds: FundingRound[],
        id: number, email: string, password: string,
        tam: string, sam: string, som: string,
        teamExperience: string, industry: string,
        tags: Tag[]
    ) {
        super(id, email, password);
        this.title = title;
        this.description = description;
        this.fundingGoal = fundingGoal;
        this.presentationPath = presentationPath;
        this.fundingRounds = fundingRounds;
        this.tam = tam;
        this.sam = sam;
        this.som = som;
        this.teamExperience = teamExperience;
        this.industry = industry;
        this.tags = tags;
    }

    title: string;

    description: string;

    @Expose({ name: 'funding_goal' })
    fundingGoal: string;

    @Expose({ name: 'presentation_path' })
    presentationPath: string;

    @Expose({ name: 'team_experience' })
    teamExperience: string;

    industry: string;

    tam: string;

    sam: string;

    som: string;

    @Expose({ name: 'funding_rounds' })
    @Type(() => FundingRound)
    fundingRounds: FundingRound[];

    tags: Tag[];
}
