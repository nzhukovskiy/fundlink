import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Tag } from "./entities/tag/tag";
import { TagsController } from './controllers/tags/tags.controller';
import { TagsService } from './services/tags/tags.service';

@Module({
    imports: [TypeOrmModule.forFeature([Tag])],
    controllers: [TagsController],
    providers: [TagsService],
    exports: []
})
export class TagsModule {

}
