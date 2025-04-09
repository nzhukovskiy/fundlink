import { IsBoolean } from "class-validator";

export class VoteProposalDto {
    @IsBoolean()
    approve: boolean;
}
