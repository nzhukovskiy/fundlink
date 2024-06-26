import { Body, Controller, Get, Param, Put } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { FundingRoundsService } from "../services/funding-rounds.service";
import { CreateFundingRoundDto } from "../dtos/create-funding-round-dto";

@Controller('funding-rounds')
@ApiTags('funding-rounds')
export class FundingRoundsController {
    constructor(private readonly fundingRoundsService: FundingRoundsService) {
    }
    @Get(':id')
    getOne(@Param('id') id: number) {
        return this.fundingRoundsService.getOne(id);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() updateFundingRoundDto: CreateFundingRoundDto) {
        return this.fundingRoundsService.update(id, updateFundingRoundDto);
    }
}
