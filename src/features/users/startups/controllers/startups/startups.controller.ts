import { Body, Controller, Get, Post } from "@nestjs/common";
import { StartupsService } from "../../services/startups.service";
import { CreateStartupDto } from "../../dtos/create-startup-dto";
import { UsersService } from "../../../services/users.service";

@Controller('startups')
export class StartupsController {

    constructor(private readonly startupsService: StartupsService,
                private readonly usersService: UsersService) {
    }
    @Get()
    findAll() {
        return this.startupsService.getAll();
    }

    @Post()
    create(@Body() createStartupDto: CreateStartupDto) {
        return this.startupsService.create(createStartupDto);
    }
}
