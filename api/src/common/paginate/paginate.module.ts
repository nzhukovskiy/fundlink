import { Module } from "@nestjs/common"
import { PaginateService } from "./services/paginate/paginate.service"

@Module({
    providers: [PaginateService],
    exports: [PaginateService],
})
export class PaginateModule {
}
