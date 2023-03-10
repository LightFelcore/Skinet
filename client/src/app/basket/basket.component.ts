import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

/* Custom Services */
import { BasketService } from 'src/app/basket/basket.service';

/* Custon Interfaces */
import { IBasket, IBasketItem, IBasketTotals } from '../shared/models/basket';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit {

  basket$: Observable<IBasket>
  basketTotals$: Observable<IBasketTotals>

  constructor(
    private basketService: BasketService
  ) {}

  ngOnInit(): void {
    this.basket$ = this.basketService.basket$;
    this.basketTotals$ = this.basketService.basketTotal$;
  }

  removeItemFromBasket(item: IBasketItem) {
    this.basketService.removeItemFromBasket(item);
  }

  incrementItemQuantity(item: IBasketItem) {
    this.basketService.incrementItemQuantity(item);
  }

  decrementItemQuantity(item: IBasketItem) {
    this.basketService.decrementItemQuantity(item);
  }

}
