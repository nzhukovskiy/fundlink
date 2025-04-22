import { Body, Controller, Param, Post, Req, UseGuards } from "@nestjs/common";
import { VoteProposalDto } from "../../dtos/vote-proposal.dto/vote-proposal.dto";
import { Roles } from "../../../auth/decorators/roles.decorator";
import { AuthGuard } from "../../../auth/guards/auth.guard";
import { RolesGuard } from "../../../auth/guards/roles.guard";
import { ChangeProposalService } from "../../services/change-proposal-service/change-proposal.service";

@Controller('proposals')
export class ProposalsController {

    constructor(private readonly changeProposalService: ChangeProposalService) {
    }

    @Roles('INVESTOR')
    @UseGuards(AuthGuard, RolesGuard)
    @Post(':id/vote')
    vote(@Param('id') id: number, @Body() voteProposalDto: VoteProposalDto, @Req() req) {
        return this.changeProposalService.vote(id, req.token.payload.id, voteProposalDto);
    }
}
