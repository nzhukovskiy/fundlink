import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { FundingRoundsService } from "../services/funding-rounds.service";
import { CreateFundingRoundDto } from "../dtos/create-funding-round-dto";
import { CreateInvestmentDto } from "../dtos/create-investment-dto";
import { InvestmentService } from "../services/investment.service";
import { User } from "../../users/user/user";
import { AuthGuard } from "../../auth/guards/auth.guard";

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

    @Put(':id')
    update(@Param('id') id: number, @Body() updateFundingRoundDto: CreateFundingRoundDto) {
        return this.fundingRoundsService.update(id, updateFundingRoundDto);
    }

    @UseGuards(AuthGuard)
    @Post(':id/investments')
    createInvestment(@Param('id') id: number, @Body() createInvestmentDto: CreateInvestmentDto, @Req() req) {
        return this.investmentService.create(id, createInvestmentDto, req.token.payload);
    }
}
