import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { StartupsService } from "../../services/startups.service";
import { CreateStartupDto } from "../../dtos/create-startup-dto";
import { Paginate, PaginateQuery } from "nestjs-paginate";
import { UpdateStartupDto } from "../../dtos/update-startup-dto";
import { ApiTags } from "@nestjs/swagger";
import { CreateFundingRoundDto } from "../../../../investments/dtos/create-funding-round-dto";
import { FundingRoundsService } from "../../../../investments/services/funding-rounds.service";

@Controller('startups')
@ApiTags('startups')
export class StartupsController {

    constructor(private readonly startupsService: StartupsService,
                private readonly fundingRoundsService: FundingRoundsService) {
    }
    @Get()
    findAll(@Paginate() query: PaginateQuery) {
        return this.startupsService.getAll(query);
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.startupsService.getOne(id);
    }

    @Post()
    create(@Body() createStartupDto: CreateStartupDto) {
        return this.startupsService.create(createStartupDto);
    }

    @Patch(':id')
    update(@Param('id') id: number, @Body() updateStartupDto: UpdateStartupDto) {
        return this.startupsService.update(id, updateStartupDto);
    }

    @Post(':id/funding-rounds')
    createFundingRound(@Param('id') id: number, @Body() createFundingRoundDto: CreateFundingRoundDto) {
        return this.fundingRoundsService.create(id, createFundingRoundDto);
    }

    @Get(':id/funding-rounds')
    getFundingRounds(@Param('id') id: number) {
        return this.fundingRoundsService.getForStartup(id);
    }

    @Get(':id/current-funding-round')
    getCurrentFundingRound(@Param('id') id: number) {
        return this.fundingRoundsService.getCurrentFundingRound(id);
    }
}
