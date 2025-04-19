import { ExitType } from "../../../constants/exit-type";
import { IsEnum, IsNumberString, IsOptional } from "class-validator";

export class ExitStartupDto {
    @IsEnum(ExitType)
    type: ExitType;

    @IsNumberString()
    @IsOptional()
    value: string;
}
