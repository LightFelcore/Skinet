/* Standard Modules */
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

/* Custom Models */
import { IPagination } from 'src/app/shared/models/pagination';
import { IProductBrand } from 'src/app/shared/models/productBrand';
import { IProductType } from 'src/app/shared/models/productType';

/* Custom Classes */
import { ShopParams } from '../shared/models/shopParams';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  baseUrl: string = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  getProducts(shopParams: ShopParams): Observable<IPagination> {
    // Params object to pass through the request
    let params = new HttpParams();

    if(shopParams.brandId !== 0) params = params.append("brandId", shopParams.brandId.toString());
    if(shopParams.typeId !== 0) params = params.append("typeId", shopParams.typeId.toString());
    if(shopParams.search) params = params.append("search", shopParams.search);
    
    params = params.append("sort", shopParams.sort);
    params = params.append("pageIndex", shopParams.pageNumber.toString());
    params = params.append("pageSize", shopParams.pageSize.toString());

    return this.http.get<IPagination>(this.baseUrl + "/products", { observe: 'response', params })
      .pipe(map(response => { return response.body }))
  }

  getBrands(): Observable<IProductBrand[]> {
    return this.http.get<IProductBrand[]>(this.baseUrl + "/products/brands");
  }

  getTypes(): Observable<IProductType[]> {
    return this.http.get<IProductType[]>(this.baseUrl + "/products/types");
  }
}
