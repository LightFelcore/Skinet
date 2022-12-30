import { IProduct } from "src/app/shared/models/product";

export interface IPagination {
    pageIndex: number;
    pageSize: number;
    count: number;
    data: IProduct[];
}