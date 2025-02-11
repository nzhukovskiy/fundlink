import {UpdateStartupDto} from "./update-startup-dto";

export class CreateStartupDto extends UpdateStartupDto {
  email: string;
  password: string;

  constructor(email: string, password: string,
    title: string,
        description: string,
        fundingGoal: string,
        tam: string,
        sam: string,
        som: string,
        teamExperience: string,
        // industry: string,
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
      revenuePerYear,
      capitalExpenditures,
      changesInWorkingCapital,
      deprecationAndAmortization
      );
    this.email = email;
    this.password = password;
  }
}
