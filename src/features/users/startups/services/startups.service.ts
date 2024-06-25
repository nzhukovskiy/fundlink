import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Startup } from "../entities/startup";
import { Repository } from "typeorm";
import { CreateStartupDto } from "../dtos/create-startup-dto";
import * as bcrypt from "bcrypt";
import { JwtSecretRequestType, JwtService } from "@nestjs/jwt";
import { PaginateService } from "../../common/services/paginate/paginate.service";
import { Paginate, PaginateQuery } from "nestjs-paginate";
import { UpdateStartupDto } from "../dtos/update-startup-dto";
import { UsersService } from "../../services/users.service";

@Injectable()
export class StartupsService {
    constructor(@InjectRepository(Startup) private readonly startupRepository: Repository<Startup>,
                private readonly jwtService: JwtService,
                private readonly paginateService: PaginateService,
                private readonly usersService: UsersService) {
    }

    getAll(query: PaginateQuery) {
        return this.paginateService.paginate(query, this.startupRepository);
    }

    getOne(id: number) {
        return this.startupRepository.findOneBy({id: id});
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

    async update(id: number, updateStartupDto: UpdateStartupDto) {
        let startup = await this.startupRepository.findOne({ where: {id: id} });
        if (!startup) {
            throw new NotFoundException("Startup does not exist")
        }
        Object.assign(startup, updateStartupDto);
        return this.startupRepository.save(startup);
    }
}
