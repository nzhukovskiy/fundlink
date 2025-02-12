import { Injectable } from '@nestjs/common';
import { paginate, PaginateQuery } from "nestjs-paginate";
import { Repository, SelectQueryBuilder } from "typeorm";

@Injectable()
export class PaginateService {
    paginate(query: PaginateQuery, repository: Repository<any> | SelectQueryBuilder<any>, config = {}) {
        return paginate(query, repository, {
            ...config,
            sortableColumns: ['id'],
            origin: "http://localhost:3000"
        })
    }
}
