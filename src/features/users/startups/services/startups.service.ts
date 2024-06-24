import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Startup } from "../entities/startup";
import { Repository } from "typeorm";
import { CreateStartupDto } from "../dtos/create-startup-dto";
import * as bcrypt from "bcrypt";
import { JwtSecretRequestType, JwtService } from "@nestjs/jwt";

@Injectable()
export class StartupsService {
    constructor(@InjectRepository(Startup) private readonly startupRepository: Repository<Startup>,
                private readonly jwtService: JwtService) {
    }

    getAll() {
        return this.startupRepository.find();
    }

    async create(createStartupDto: CreateStartupDto) {
        let startup = createStartupDto;
        startup.password = await bcrypt.hash(startup.password, 10);
        let savedStartup = await this.startupRepository.save(startup);
        console.log(savedStartup)
        return {
            accessToken: await this.jwtService.signAsync({id: savedStartup.id, email: savedStartup.email})
        }
    }
}
