import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasketComponent } from 'src/app/basket/basket.component';
import { BasketRoutingModule } from 'src/app/basket/basket-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    BasketComponent
  ],
  imports: [
    CommonModule,
    BasketRoutingModule,
    SharedModule
  ]
})
export class BasketModule { }
