import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { InvestorsService } from "../services/investors.service";
import { CreateInvestorDto } from "../dtos/create-investor-dto";
import { Paginate, PaginateQuery } from "nestjs-paginate";
import { ApiTags } from "@nestjs/swagger";

@Controller('investors')
@ApiTags('investors')
export class InvestorsController {
    constructor(private readonly investorsService: InvestorsService) {
    }
    @Get()
    findAll(@Paginate() query: PaginateQuery) {
        return this.investorsService.getAll(query);
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.investorsService.getOne(id);
    }

    @Post()
    create(@Body() createInvestorDto: CreateInvestorDto) {
        return this.investorsService.create(createInvestorDto);
    }
}
