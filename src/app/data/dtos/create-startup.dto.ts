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
        industry: string) {
    super(title,
      description,
      fundingGoal,
      tam,
      sam,
      som,
      teamExperience,
      industry);
    this.email = email;
    this.password = password;
  }
}
