import {Startup} from "../../models/startup";
import {FundingRound} from "../../models/funding-round";
import {Tag} from "../../models/tag";

export class StartupFullDto extends Startup {
    totalInvestment: string;

    sharePercentage: string;

    totalInvestmentsForStartup: string;

    constructor(title: string, description: string, fundingGoal: string, presentationPath: string, logoPath: string, autoApproveInvestments: boolean, fundingRounds: FundingRound[], id: number, email: string, password: string, tam: string, sam: string, som: string, teamExperience: string, industry: string, tags: Tag[], dcf: string, revenuePerYear: number[], capitalExpenditures: number[], changesInWorkingCapital: number[], deprecationAndAmortization: number[], totalInvestment: string, sharePercentage: string, totalInvestmentForStartup: string, totalInvestmentsForStartup: string) {
        super(title, description, fundingGoal, presentationPath, logoPath, autoApproveInvestments, fundingRounds, id, email, password, tam, sam, som, teamExperience, industry, tags, dcf, revenuePerYear, capitalExpenditures, changesInWorkingCapital, deprecationAndAmortization, totalInvestment, sharePercentage, totalInvestmentForStartup);
        this.totalInvestment = totalInvestment;
        this.sharePercentage = sharePercentage;
        this.totalInvestmentsForStartup = totalInvestmentsForStartup;
    }
}
