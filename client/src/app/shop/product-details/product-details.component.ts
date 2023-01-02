import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

/* Custom Interfaces */
import { IProduct } from 'src/app/shared/models/product';

/* Custom Services */
import { ShopService } from 'src/app/shop/shop.service';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  
  product: IProduct;

  constructor(
    private shopService: ShopService,
    private activatedRoute: ActivatedRoute,
    private bcService: BreadcrumbService
  ) {
    this.bcService.set('@productDetails', ' ')
  }

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct() {
    this.shopService.getProduct(+this.activatedRoute.snapshot.paramMap.get('id')).subscribe({
      next: (response: IProduct) => {
        this.product = response
        this.bcService.set('@productDetails', this.product.name)
      },
      error: (error: HttpErrorResponse) => console.log(error)
    })
  }

}