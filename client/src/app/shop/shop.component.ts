/* Standard Modules */
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { map, throwError } from 'rxjs';

/* Custom Models */
import { IProduct } from 'src/app/shared/models/product';

/* Custom Services */
import { ShopService } from 'src/app/shop/shop.service';

/* Custom Models */
import { IProductBrand } from 'src/app/shared/models/productBrand';
import { IProductType } from 'src/app/shared/models/productType';

/* Custom Classes */
import { ShopParams } from 'src/app/shared/models/shopParams';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {

  @ViewChild("search", { static: false }) searchTerm: ElementRef;
  
  products: IProduct[];
  brands: IProductBrand[];
  types: IProductType[];

  totalProductCount: number;

  shopParams: ShopParams;

  sortOptions = [
    { name: "Alphabetical", value: "name" },
    { name: "Price: Low to High", value: "priceAsync" },
    { name: "Price: High to Low", value: "priceDesc" }
  ];

  returnUrl: string;
  
  constructor(
    private shopService: ShopService
  ) {
    this.shopParams = this.shopService.getShopParams();
  }
  
  ngOnInit(): void {
    this.getProducts(true)
    this.getBrands();
    this.getTypes();
  }

  getProducts(useCache = false): void {
    this.shopService.getProducts(useCache).subscribe({
      next: (response) => {
        this.products = response.data,
        this.totalProductCount = response.count
      },
      error: (e: HttpErrorResponse) => console.log(e)
    });
  }

  getBrands(): void {
    this.shopService.getBrands().subscribe({
      next: (response) => this.brands = [{name: "All", id: 0}, ...response],
      error: (e: HttpErrorResponse) => console.log(e)
    })
  }

  getTypes(): void {
    this.shopService.getTypes().subscribe({
      next: (response) => this.types = [{ name: "All", id: 0}, ...response],
      error: (e: HttpErrorResponse) => console.log(e)
    })
  }

  onBrandSelected(brandId: number) {
    const params = this.shopService.getShopParams();
    params.brandId = brandId;
    params.pageNumber = 1;
    this.shopService.setShopParams(params);
    this.getProducts();
  }

  onTypeSelected(typeId: number) {
    const params = this.shopService.getShopParams();
    params.typeId = typeId;
    params.pageNumber = 1;
    this.shopService.setShopParams(params);
    this.getProducts();
  }

  onSortSelected(sort: string) {
    const params = this.shopService.getShopParams();
    params.sort = sort;
    this.shopService.setShopParams(params);
    this.getProducts();
  }

  onPageChanged(event: any) {
    const params = this.shopService.getShopParams();
    // The if statement is needed because when a filter is selected the getProduct method is called twice (duplicate api request for the same data)
    // in order to resolve this, there should be a check if this method is called only for changing the page, in this case the products can be requested form the api
    if(params.pageNumber !== event) {
      params.pageNumber = event;
      this.shopService.setShopParams(params);
      this.getProducts(true);
    }
  }

  onSearch() {
    const params = this.shopService.getShopParams();
    params.search = this.searchTerm.nativeElement.value;
    params.pageNumber = 1;
    this.shopService.setShopParams(params);
    this.getProducts();
  }

  onReset() {
    // Reset the search term
    this.searchTerm.nativeElement.value = "";
    // Reset all the filters
    this.shopParams = new ShopParams();
    this.shopService.setShopParams(this.shopParams);
    this.getProducts();
  }
}
