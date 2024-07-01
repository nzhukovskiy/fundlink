import {UpdateStartupDto} from "./update-startup-dto";

export interface CreateStartupDto extends UpdateStartupDto {
  email: string;
  password: string;
}
