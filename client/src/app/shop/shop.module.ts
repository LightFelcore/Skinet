import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* Custom Components */
import { ShopComponent } from 'src/app/shop/shop.component';
import { ProductItemComponent } from 'src/app/shop/product-item/product-item.component';

/* Custom Modules */
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ShopComponent,
    ProductItemComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    ShopComponent
  ]
})
export class ShopModule { }
