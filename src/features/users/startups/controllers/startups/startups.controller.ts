import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post, Query,
    Req,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from "@nestjs/common";
import { StartupsService } from "../../services/startups.service";
import { CreateStartupDto } from "../../dtos/requests/create-startup-dto";
import { Paginate, PaginateQuery } from "nestjs-paginate";
import { UpdateStartupDto } from "../../dtos/requests/update-startup-dto";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { CreateFundingRoundDto } from "../../../../investments/dtos/create-funding-round-dto";
import { FundingRoundsService } from "../../../../investments/services/funding-rounds.service";
import { AuthGuard } from "../../../../auth/guards/auth.guard";
import { Roles } from "../../../../auth/decorators/roles.decorator";
import { RolesGuard } from "../../../../auth/guards/roles.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { presentationFileFilter } from "../../storage/presentations/presentation-file-filter";
import { fileStorage } from "../../storage/file-storage";
import { AssignTagDto } from "../../dtos/requests/assign-tag-dto";
import { logoFileFilter } from "../../storage/logos/logo-file-filter";
import { OptionalAuthGuard } from "../../../../auth/guards/optional-auth/optional-auth.guard"
import { ExitStartupDto } from "../../dtos/requests/exit-startup.dto";


@Controller('startups')
@ApiTags('startups')
export class StartupsController {

    constructor(private readonly startupsService: StartupsService,
                private readonly fundingRoundsService: FundingRoundsService) {
    }
    
    @UseGuards(OptionalAuthGuard)
    @Get()
    findAll(
        @Paginate() query: PaginateQuery,
        @Query("title") title: string,
        @Query("tag") tag: string,
        @Query("isInteresting") isInteresting: boolean,
        @Query("onlyActive") onlyActive: boolean,
        @Query("includeExited") includeExited: boolean,
        @Req() req
    ) {
        return this.startupsService.getAll(query, title, tag, isInteresting, onlyActive, includeExited, isInteresting && req.token && req.token.payload.role === "investor" ? req.token.payload.id : undefined);
    }

    @ApiBearerAuth()
    @Roles('startup')
    @UseGuards(AuthGuard, RolesGuard)
    @Get('current-startup')
    findCurrentStartup(@Req() req) {
        return this.startupsService.getCurrent(req.token.payload);
    }

    @Get('most-popular')
    getMostPopularStartups(@Req() req) {
        return this.startupsService.getMostPopularStartups();
    }

    @Get('most-funded')
    getMostFundedStartups(@Req() req) {
        return this.startupsService.getMostFundedStartups();
    }

    @UseGuards(OptionalAuthGuard)
    @Get(':id')
    findOne(@Param('id') id: number,
            @Query('includeInvestments') includeInvestments: boolean,
            @Req() req) {
        return this.startupsService.getOne(id, includeInvestments, req.token ? req.token.payload.id : undefined);
    }

    @ApiBody({ type: CreateStartupDto })
    @Post()
    create(@Body() createStartupDto: CreateStartupDto) {
        return this.startupsService.create(createStartupDto);
    }

    @ApiBearerAuth()
    @ApiBody({ type: UpdateStartupDto })
    @Roles('startup')
    @UseGuards(AuthGuard, RolesGuard)
    @Patch('')
    update(@Body() updateStartupDto: UpdateStartupDto, @Req() req) {
        return this.startupsService.update(req.token.payload.id, updateStartupDto);
    }

    @ApiBearerAuth()
    @ApiBody({ type: CreateFundingRoundDto })
    @Roles('startup')
    @UseGuards(AuthGuard, RolesGuard)
    @Post('funding-rounds')
    createFundingRound(@Body() createFundingRoundDto: CreateFundingRoundDto, @Req() req) {
        return this.fundingRoundsService.create(req.token.payload.id, createFundingRoundDto);
    }

    @Get(':id/funding-rounds')
    getFundingRounds(@Param('id') id: number) {
        return this.fundingRoundsService.getForStartup(id);
    }

    @Get(':id/current-funding-round')
    getCurrentFundingRound(@Param('id') id: number) {
        return this.fundingRoundsService.getCurrentFundingRound(id);
    }

    @Get(':id/investors')
    getStartupInvestors(@Param('id') id: number, @Query('fundingRoundId') fundingRoundId: number) {
        return this.startupsService.getInvestors(id, fundingRoundId);
    }

    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                presentation: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @Roles('startup')
    @UseGuards(AuthGuard, RolesGuard)
    @Post('upload-presentation')
    @UseInterceptors(FileInterceptor('presentation', {
        storage: fileStorage("presentations"),
        fileFilter: presentationFileFilter
    }))
    async uploadStartupPresentation(@UploadedFile() file: Express.Multer.File, @Req() req) {
        if (!file) {
            throw new BadRequestException("No file provided");
        }
        const user = req.token.payload;
        return this.startupsService.uploadPresentation(user.id, file.filename);
    }

    @Roles('startup')
    @UseGuards(AuthGuard, RolesGuard)
    @Post("assign-tag")
    assignTag(@Body() assignTagDto: AssignTagDto, @Req() req) {
        return this.startupsService.assignTag(assignTagDto.tagId, req.token.payload.id);
    }

    @Roles('startup')
    @UseGuards(AuthGuard, RolesGuard)
    @Post("remove-tag")
    removeTag(@Body() assignTagDto: AssignTagDto, @Req() req) {
        return this.startupsService.removeTag(assignTagDto.tagId, req.token.payload.id);
    }

    @Roles('startup')
    @UseGuards(AuthGuard, RolesGuard)
    @Post('upload-logo')
    @UseInterceptors(FileInterceptor('logo', {
        storage: fileStorage("logos"),
        fileFilter: logoFileFilter
    }))
    async uploadLogo(@UploadedFile() file: Express.Multer.File, @Req() req) {
        console.log(file)
        if (!file) {
            throw new BadRequestException("No file provided");
        }
        const user = req.token.payload;
        return this.startupsService.uploadLogo(user.id, file.filename);
    }

    @Roles('investor')
    @UseGuards(AuthGuard, RolesGuard)
    @Post(":id/mark-as-interesting")
    markAsInteresting(@Param('id') id: number, @Req() req) {
        return this.startupsService.markAsInteresting(id, req.token.payload.id);
    }

    @Roles('investor')
    @UseGuards(AuthGuard, RolesGuard)
    @Post(":id/remove-from-interesting")
    removeFromInteresting(@Param('id') id: number, @Req() req) {
        return this.startupsService.removeFromInteresting(id, req.token.payload.id);
    }

    @Roles('startup')
    @UseGuards(AuthGuard, RolesGuard)
    @Post("exit")
    exitStartup(@Body() exitStartupDto: ExitStartupDto, @Req() req) {
        return this.startupsService.exitStartup(req.token.payload.id, exitStartupDto);
    }
}
