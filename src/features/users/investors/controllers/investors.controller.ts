import { Body, Controller, Get, Post } from "@nestjs/common";
import { InvestorsService } from "../services/investors.service";
import { CreateInvestorDto } from "../dtos/create-investor-dto";

@Controller('investors')
export class InvestorsController {
    constructor(private readonly investorsService: InvestorsService) {
    }
    @Get()
    findAll() {
        return this.investorsService.getAll();
    }

    @Post()
    create(@Body() createInvestorDto: CreateInvestorDto) {
        return this.investorsService.create(createInvestorDto);
    }
}
