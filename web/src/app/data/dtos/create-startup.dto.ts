import { UpdateStartupDto } from './update-startup-dto';

export class CreateStartupDto extends UpdateStartupDto {
    email: string;
    password: string;
    initialFundingGoal: string;
    preMoney: string;


    constructor(title: string, description: string, fundingGoal: string, tam: string, sam: string, som: string, teamExperience: string, autoApproveInvestments: boolean, revenuePerYear: number[], capitalExpenditures: number[], changesInWorkingCapital: number[], deprecationAndAmortization: number[], email: string, password: string, initialFundingGoal: string, preMoney: string) {
        super(title, description, fundingGoal, tam, sam, som, teamExperience, autoApproveInvestments, revenuePerYear, capitalExpenditures, changesInWorkingCapital, deprecationAndAmortization);
        this.email = email;
        this.password = password;
        this.initialFundingGoal = initialFundingGoal;
        this.preMoney = preMoney;
    }
}
