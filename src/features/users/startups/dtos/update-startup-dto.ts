import { IsNotEmpty, IsNumberString } from "class-validator";

export class UpdateStartupDto {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    description: string;

    @IsNumberString()
    fundingGoal: number;
}
