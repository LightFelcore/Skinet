/* Standard Modules */
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

/* Custom Models */
import { IPagination, Pagination } from 'src/app/shared/models/pagination';
import { IProductBrand } from 'src/app/shared/models/productBrand';
import { IProductType } from 'src/app/shared/models/productType';

/* Custom Classes */
import { ShopParams } from 'src/app/shared/models/shopParams';
import { IProduct } from 'src/app/shared/models/product';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  baseUrl: string = environment.apiUrl;

  products: IProduct[] = [];
  brands: IProductBrand[] = [];
  types: IProductType[] = [];

  pagination = new Pagination();
  shopParams = new ShopParams();

  productCache = new Map();

  constructor(
    private http: HttpClient
  ) { }

  getProducts(useCache: boolean): Observable<IPagination> {

    // If we dont want to cache, set productCache equal to a new map
    if(useCache === false) {
      this.productCache = new Map();
    }

    // If we want to cache and there are items in the map already
    if(this.productCache.size > 0 && useCache === true) {
      // Check to see if already available in cache by checking the key
      // If the data could not be find in the cache, the rest of the code will be executed and the api request will be made
      if(this.productCache.has(Object.values(this.shopParams).join('-'))) {
        this.pagination.data = this.productCache.get(Object.values(this.shopParams).join('-'))
        console.log(Object.values(this.shopParams).join('-'))
        return of(this.pagination);
      }
    }

    // Params object to pass through the request
    let params = new HttpParams();

    if (this.shopParams.brandId !== 0) params = params.append("brandId", this.shopParams.brandId.toString());
    if (this.shopParams.typeId !== 0) params = params.append("typeId", this.shopParams.typeId.toString());
    if (this.shopParams.search) params = params.append("search", this.shopParams.search);

    params = params.append("sort", this.shopParams.sort);
    params = params.append("pageIndex", this.shopParams.pageNumber.toString());
    params = params.append("pageSize", this.shopParams.pageSize.toString());

    return this.http.get<IPagination>(this.baseUrl + "/products", { observe: 'response', params })
      .pipe(map(response => {
        
        // Set the obtained data from the api in cache map
        this.productCache.set(Object.values(this.shopParams).join('-'), response.body.data)

        this.pagination = response.body;

        return this.pagination;
      }))
  }

  setShopParams(params: ShopParams): void {
    this.shopParams = params;
  }

  getShopParams(): ShopParams {
    return this.shopParams;
  }

  getProduct(id: number) {
    let product: IProduct;

    // Check in cache to see if the product is available with given id
    this.productCache.forEach((products: IProduct[]) => {
      product = products.find(p => p.id === id);
    })

    // If the product is available in cache return the cached product
    if (product) {
      return of(product);
    }

    // If the product is not available in cache make the api request
    return this.http.get<IProduct>(this.baseUrl + "/products/" + id);
  }

  getBrands(): Observable<IProductBrand[]> {
    if (this.brands.length > 0) {
      return of(this.brands);
    }
    return this.http.get<IProductBrand[]>(this.baseUrl + "/products/brands")
      .pipe(
        map((response: IProductBrand[]) => {
          this.brands = response;
          return response;
        })
      );
  }

  getTypes(): Observable<IProductType[]> {
    if (this.types.length > 0) {
      return of(this.types);
    }
    return this.http.get<IProductType[]>(this.baseUrl + "/products/types")
      .pipe(
        map((response: IProductType[]) => {
          this.types = response;
          return this.types;
        })
      );
  }


}
