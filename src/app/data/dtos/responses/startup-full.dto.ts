import {Startup} from "../../models/startup";
import {FundingRound} from "../../models/funding-round";
import {Tag} from "../../models/tag";
import { DcfDetailedDto } from './dcf-calculation-details';

export class StartupFullDto extends Startup {
    totalInvestment: string;

    sharePercentage: string;

    totalInvestmentsForStartup: string;


    constructor(id: number, email: string, password: string, title: string, description: string, fundingGoal: string, presentationPath: string, logoPath: string, autoApproveInvestments: boolean, teamExperience: string, industry: string, tamMarket: string, samMarket: string, somMarket: string, fundingRounds: FundingRound[], tags: Tag[], dcf: DcfDetailedDto, isInteresting: boolean, revenuePerYear: number[], capitalExpenditures: number[], changesInWorkingCapital: number[], deprecationAndAmortization: number[], totalInvestment: string, sharePercentage: string, totalInvestmentsForStartup: string) {
        super(id, email, password, title, description, fundingGoal, presentationPath, logoPath, autoApproveInvestments, teamExperience, industry, tamMarket, samMarket, somMarket, fundingRounds, tags, dcf, isInteresting, revenuePerYear, capitalExpenditures, changesInWorkingCapital, deprecationAndAmortization);
        this.totalInvestment = totalInvestment;
        this.sharePercentage = sharePercentage;
        this.totalInvestmentsForStartup = totalInvestmentsForStartup;
    }
}
