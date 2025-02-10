import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FundingRound } from "../../../investments/entities/funding-round/funding-round";
import { Repository } from "typeorm";
import { Tag } from "../../entities/tag/tag";
import { Startup } from "../../../users/startups/entities/startup";

@Injectable()
export class TagsService {

    constructor(@InjectRepository(Tag) private readonly tagRepository: Repository<Tag>) {
    }

    getAll(){
        return this.tagRepository.find();
    }

    async getTag(tagId: number) {
        return this.tagRepository.findOneOrFail({where: { id: tagId }, relations: ["startups"]}).catch(_ => {
            throw new NotFoundException(`Tag with id ${tagId} does not exist`);
        });
    }
}
