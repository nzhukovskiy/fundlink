import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { InvestorsService } from "../services/investors.service";
import { CreateInvestorDto } from "../dtos/create-investor-dto";
import { Paginate, PaginateQuery } from "nestjs-paginate";
import { ApiBearerAuth, ApiBody, ApiTags } from "@nestjs/swagger";
import { UpdateInvestorDto } from "../dtos/update-investor-dto";
import { AuthGuard } from "../../../auth/guards/auth.guard";
import { RolesGuard } from "../../../auth/guards/roles.guard";
import { Roles } from "../../../auth/decorators/roles.decorator";
import { RecommendationService } from "../recommendations/services/recommendation/recommendation.service";

@Controller('investors')
@ApiTags('investors')
export class InvestorsController {
    constructor(private readonly investorsService: InvestorsService,
                private readonly recommendationService: RecommendationService) {
    }
    @Get()
    findAll(@Paginate() query: PaginateQuery) {
        return this.investorsService.getAll(query);
    }

    @ApiBearerAuth()
    @Roles('INVESTOR')
    @UseGuards(AuthGuard, RolesGuard)
    @Get('current-investor')
    findCurrentInvestor(@Req() req) {
        return this.investorsService.getCurrent(req.token.payload);
    }

    @ApiBearerAuth()
    @Roles('INVESTOR')
    @UseGuards(AuthGuard, RolesGuard)
    @Get('investments')
    getInvestments(@Req() req) {
        return this.investorsService.getFullInvestmentsInfo(req.token.payload.id);
    }

    @Roles('INVESTOR')
    @UseGuards(AuthGuard, RolesGuard)
    @Get('recommendations')
    getRecommendations(@Req() req) {
        return this.recommendationService.getRecommendationsForInvestor(req.token.payload.id);
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.investorsService.getOne(id);
    }

    @Post()
    create(@Body() createInvestorDto: CreateInvestorDto) {
        return this.investorsService.create(createInvestorDto);
    }

    @ApiBearerAuth()
    @ApiBody({ type: UpdateInvestorDto })
    @Roles('INVESTOR')
    @UseGuards(AuthGuard, RolesGuard)
    @Patch()
    update(@Body() updateInvestorDto: UpdateInvestorDto, @Req() req) {
        return this.investorsService.update(updateInvestorDto, req.token.payload);
    }

    @Get(':id/startups')
    getStartups(@Param('id') id: number) {
        return this.investorsService.getStartupsForInvestor(id);
    }

    @Get(':id/stats')
    getInvestorStats(@Param('id') id: number) {
        return this.investorsService.getStats(id);
    }

}
