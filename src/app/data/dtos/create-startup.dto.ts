import { UpdateStartupDto } from './update-startup-dto';

export class CreateStartupDto extends UpdateStartupDto {
    email: string;
    password: string;
    initialFundingGoal: string;

    constructor(email: string, password: string,
                title: string,
                description: string,
                fundingGoal: string,
                initialFundingGoal: string,
                tam: string,
                sam: string,
                som: string,
                teamExperience: string,
                // industry: string,
                autoApproveInvestments: boolean,
                revenuePerYear: number[],
                capitalExpenditures: number[],
                changesInWorkingCapital: number[],
                deprecationAndAmortization: number[]) {
        super(title,
            description,
            fundingGoal,
            tam,
            sam,
            som,
            teamExperience,
            autoApproveInvestments,
            revenuePerYear,
            capitalExpenditures,
            changesInWorkingCapital,
            deprecationAndAmortization,
        );
        this.email = email;
        this.password = password;
        this.initialFundingGoal = initialFundingGoal;
    }
}
