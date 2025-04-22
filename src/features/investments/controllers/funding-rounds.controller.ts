import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiTags } from "@nestjs/swagger";
import { FundingRoundsService } from "../services/funding-rounds.service";
import { CreateFundingRoundDto } from "../dtos/create-funding-round-dto";
import { CreateInvestmentDto } from "../dtos/create-investment-dto";
import { InvestmentService } from "../services/investment.service";
import { AuthGuard } from "../../auth/guards/auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { Roles } from "../../auth/decorators/roles.decorator";
import { VoteProposalDto } from "../dtos/vote-proposal.dto/vote-proposal.dto";

@Controller('funding-rounds')
@ApiTags('funding-rounds')
export class FundingRoundsController {
    constructor(private readonly fundingRoundsService: FundingRoundsService,
                private readonly investmentService: InvestmentService) {
    }
    @Get(':id')
    getOne(@Param('id') id: number) {
        return this.fundingRoundsService.getOne(id);
    }

    @ApiBearerAuth()
    @ApiBody({ type: CreateFundingRoundDto })
    @Roles('STARTUP')
    @UseGuards(AuthGuard, RolesGuard)
    @Put(':id')
    update(@Param('id') id: number, @Body() updateFundingRoundDto: CreateFundingRoundDto, @Req() req) {
        return this.fundingRoundsService.update(id, updateFundingRoundDto, req.token.payload);
    }

    @ApiBearerAuth()
    @ApiBody({ type: CreateInvestmentDto })
    @Roles('INVESTOR')
    @UseGuards(AuthGuard, RolesGuard)
    @Post(':id/investments')
    createInvestment(@Param('id') id: number, @Body() createInvestmentDto: CreateInvestmentDto, @Req() req) {
        return this.investmentService.create(id, createInvestmentDto, req.token.payload);
    }

    @ApiBearerAuth()
    @Roles('STARTUP')
    @UseGuards(AuthGuard, RolesGuard)
    @Delete(':id')
    deleteFundingRound(@Param('id') id: number, @Req() req) {
        return this.fundingRoundsService.delete(id, req.token.payload);
    }

    @Roles('STARTUP')
    @UseGuards(AuthGuard, RolesGuard)
    @Post(':id/cancel-proposal')
    cancelUpdateProposal(@Param('id') id: number, @Req() req) {
        return this.fundingRoundsService.cancelProposal(id, req.token.payload.id);
    }
}
