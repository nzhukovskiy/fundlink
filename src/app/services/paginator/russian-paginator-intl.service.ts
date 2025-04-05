import {MatPaginatorIntl} from "@angular/material/paginator";

export class RussianPaginatorIntlService extends MatPaginatorIntl {
    override itemsPerPageLabel = 'Элементов на странице:';
    override nextPageLabel = 'Следующая страница';
    override previousPageLabel = 'Предыдущая страница';
    override firstPageLabel = 'Первая страница';
    override lastPageLabel = 'Последняя страница';

    override getRangeLabel = (page: number, pageSize: number, length: number) => {
        if (length === 0 || pageSize === 0) {
            return `0 из ${length}`;
        }
        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        const endIndex = Math.min(startIndex + pageSize, length);
        return `${startIndex + 1} – ${endIndex} из ${length}`;
    };
}
