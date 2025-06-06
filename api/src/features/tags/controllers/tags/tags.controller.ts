import { Controller, Get, Param } from "@nestjs/common";
import { TagsService } from "../../services/tags/tags.service";
import { ApiTags } from "@nestjs/swagger";

@Controller('tags')
@ApiTags('tags')
export class TagsController {
    constructor(private readonly tagsService: TagsService) {

    }

    @Get('')
    getAll() {
        return this.tagsService.getAll();
    }

    @Get(':id')
    getTag(@Param('id') id: number) {
        return this.tagsService.getTag(id);
    }
}
