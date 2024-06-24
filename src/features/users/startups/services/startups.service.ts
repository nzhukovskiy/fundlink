import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Startup } from "../entities/startup";
import { Repository } from "typeorm";
import { CreateStartupDto } from "../dtos/create-startup-dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class StartupsService {
    constructor(@InjectRepository(Startup) private readonly startupRepository: Repository<Startup>) {
    }

    getAll() {
        return this.startupRepository.find();
    }

    async create(createStartupDto: CreateStartupDto) {
        let startup = createStartupDto;
        startup.password = await bcrypt.hash(startup.password, 10);
        return this.startupRepository.save(startup);
    }
}
