import { IProduct } from "src/app/models/product";

export interface IPagination {
    pageIndex: number;
    pageSize: number;
    count: number;
    data: IProduct[];
}