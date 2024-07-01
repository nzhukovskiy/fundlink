import { Injectable } from '@angular/core';
import { AppHttpService } from './app-http.service';
import { Startup } from '../data/models/startup';
import { Investor } from '../data/models/investor';
import {HttpParams} from "@angular/common/http";
import {PaginationResult} from "../data/dtos/pagination-result";

@Injectable({
  providedIn: 'root'
})
export class StartupService {

  constructor(private readonly appHttpService: AppHttpService) { }

    getAll(page?: number, per_page?: number) {
      let query = new HttpParams();
      if (typeof page !== "undefined") {
        query = query.append("page", page);
      }
      if (typeof per_page !== "undefined") {
        query = query.append("limit", per_page);
      }
      return this.appHttpService.get<PaginationResult<Startup>>("startups", query);
    }

    getOne(id: number) {
      return this.appHttpService.get<Startup>(`startups/${id}`);
    }

    getInvestors(id: number) {
      return this.appHttpService.get<Investor[]>(`startups/${id}/investors`);
    }

    // async getCurrent(userData: User) {
    //     return this.getOne(userData.id);
    // }

    // async create(createStartupDto: CreateStartupDto) {
    //     let startupDto = createStartupDto;
    //     if (await this.usersService.findByEmail(startupDto.email)) {
    //         throw new BadRequestException(`User with email ${startupDto.email} already exists`);
    //     }
    //     startupDto.password = await bcrypt.hash(startupDto.password, 10);
    //     let savedStartup = await this.startupRepository.save(startupDto);
    //     await this.fundingRoundsService.create(savedStartup.id, {
    //         fundingGoal: "10000",
    //         startDate: new Date(),
    //         endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
    //     })
    //     let startup = await this.startupRepository.findOneBy({id: savedStartup.id});
    //     delete startup.password;
    //     startup["role"] = startup.getRole();
    //     return {
    //         accessToken: await this.jwtTokenService.generateToken(startup)
    //     }
    // }

    // async update(id: number, updateStartupDto: UpdateStartupDto) {
    //     let startup = await this.startupRepository.findOne({ where: {id: id} });
    //     if (!startup) {
    //         throw new NotFoundException(`Startup with an id ${id} does not exist`);
    //     }
    //     Object.assign(startup, updateStartupDto);
    //     return this.startupRepository.save(startup);
    // }

    // async getInvestors(id: number) {
    //     return this.investorRepository.createQueryBuilder('investor')
    //       .innerJoin('investor.investments', 'investment')
    //       .innerJoin('investment.fundingRound', 'fundingRound')
    //       .innerJoin('fundingRound.startup', 'startup')
    //       .where('startup.id = :id', { id })
    //       .select(['investor.id', 'investor.name', 'investor.surname', 'investor.email'])
    //       .distinct(true)
    //       .getMany();
    // }

    // async uploadPresentation(startupId: number, fileName: string) {
    //     const startup = await this.startupRepository.findOneBy({id: startupId});
    //     if (!startup) {
    //         throw new NotFoundException('Startup with this id not found');
    //     }
    //     startup.presentationPath = fileName;
    //     return this.startupRepository.save(startup);
    // }
}
