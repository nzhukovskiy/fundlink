import { UpdateInvestorDto } from "./update-investor.dto";

export interface CreateInvestorDto extends UpdateInvestorDto {
  email: string;
  password: string;
}
