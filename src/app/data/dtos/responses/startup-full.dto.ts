import {Startup} from "../../models/startup";
import {FundingRound} from "../../models/funding-round";
import {Tag} from "../../models/tag";
import { DcfDetailedDto } from './dcf-calculation-details';
import {StartupStage} from "../../../constants/startup-stage";
import {Exit} from "../../models/exit";

export class StartupFullDto extends Startup {
    totalInvestment: string;

    sharePercentage: string;

    totalInvestmentsForStartup: string;

    preMoney: string;


    constructor(id: number, email: string, password: string, title: string, description: string, fundingGoal: string, presentationPath: string, logoPath: string, autoApproveInvestments: boolean, teamExperience: string, industry: string, tamMarket: string, samMarket: string, somMarket: string, fundingRounds: FundingRound[], tags: Tag[], dcf: DcfDetailedDto, isInteresting: boolean, investmentsTotal: number, revenuePerYear: number[], capitalExpenditures: number[], changesInWorkingCapital: number[], deprecationAndAmortization: number[], stage: StartupStage, joinedAt: Date, exit: Exit, totalInvestment: string, sharePercentage: string, totalInvestmentsForStartup: string, preMoney: string) {
        super(id, email, password, title, description, fundingGoal, presentationPath, logoPath, autoApproveInvestments, teamExperience, industry, tamMarket, samMarket, somMarket, fundingRounds, tags, dcf, isInteresting, investmentsTotal, revenuePerYear, capitalExpenditures, changesInWorkingCapital, deprecationAndAmortization, stage, joinedAt, exit);
        this.totalInvestment = totalInvestment;
        this.sharePercentage = sharePercentage;
        this.totalInvestmentsForStartup = totalInvestmentsForStartup;
        this.preMoney = preMoney;
    }
}
