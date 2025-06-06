import { IsBoolean } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class VoteProposalDto {
    @ApiProperty()
    @IsBoolean()
    approve: boolean;
}
