import { IProduct } from "src/app/shared/models/product";

export interface IPagination {
    pageIndex: number;
    pageSize: number;
    count: number;
    data: IProduct[];
}

export class Pagination implements IPagination{
    pageIndex: number;
    pageSize: number;
    count: number;
    data: IProduct[] = [];

}