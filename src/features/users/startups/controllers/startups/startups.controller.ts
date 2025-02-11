import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Req,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from "@nestjs/common";
import { StartupsService } from "../../services/startups.service";
import { CreateStartupDto } from "../../dtos/create-startup-dto";
import { Paginate, PaginateQuery } from "nestjs-paginate";
import { UpdateStartupDto } from "../../dtos/update-startup-dto";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { CreateFundingRoundDto } from "../../../../investments/dtos/create-funding-round-dto";
import { FundingRoundsService } from "../../../../investments/services/funding-rounds.service";
import { AuthGuard } from "../../../../auth/guards/auth.guard";
import { Roles } from "../../../../auth/decorators/roles.decorator";
import { RolesGuard } from "../../../../auth/guards/roles.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { fileFilter } from "../../presentations/constants/file-filter";
import { presentationStorage } from "../../presentations/constants/presentation-storage";
import { AssignTagDto } from "../../dtos/assign-tag-dto";


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

    @ApiBearerAuth()
    @Roles('startup')
    @UseGuards(AuthGuard, RolesGuard)
    @Get('current-startup')
    findCurrentStartup(@Req() req) {
        return this.startupsService.getCurrent(req.token.payload);
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.startupsService.getOne(id);
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
    getStartupInvestors(@Param('id') id: number) {
        return this.startupsService.getInvestors(id);
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
        storage: presentationStorage,
        fileFilter: fileFilter
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
}
