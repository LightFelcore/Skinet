import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* Custom Components */
import { ShopComponent } from 'src/app/shop/shop.component';
import { ProductItemComponent } from 'src/app/shop/product-item/product-item.component';

/* Custom Modules */
import { SharedModule } from 'src/app/shared/shared.module';
import { ProductDetailsComponent } from 'src/app/shop/product-details/product-details.component';
import { ShopRoutingModule } from 'src/app/shop/shop-routing.module';


@NgModule({
  declarations: [
    ShopComponent,
    ProductItemComponent,
    ProductDetailsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ShopRoutingModule
  ]
})
export class ShopModule { }
