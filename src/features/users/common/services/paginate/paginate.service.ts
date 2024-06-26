import { Injectable } from '@nestjs/common';
import { paginate, PaginateQuery } from "nestjs-paginate";
import { Repository } from "typeorm";

@Injectable()
export class PaginateService {
    paginate(query: PaginateQuery, repository: Repository<any>) {
        return paginate(query, repository, {
            sortableColumns: ['id'],
            origin: "http://localhost:3000"
        })
    }
}
