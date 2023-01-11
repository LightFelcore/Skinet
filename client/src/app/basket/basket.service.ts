import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Basket, IBasket, IBasketItem, IBasketTotals } from '../shared/models/basket';
import { IDeliveryMethod } from '../shared/models/deliveryMethod';
import { IProduct } from '../shared/models/product';

@Injectable({
  providedIn: 'root'
})
export class BasketService {

  baseUrl: string = environment.apiUrl;

  // A BehaviourSubject will always emit an initial value
  private basketSource: BehaviorSubject<IBasket> = new BehaviorSubject<IBasket>(null);
  basket$: Observable<IBasket> = this.basketSource.asObservable();

  private basketTotalSource = new BehaviorSubject<IBasketTotals>(null);
  basketTotal$: Observable<IBasketTotals> = this.basketTotalSource.asObservable();

  shipping: number = 0;

  constructor(
    private http: HttpClient
  ) { }

  createPaymentIntent() {
    return this.http.post(this.baseUrl + '/payment/' + this.getCurrentBasketValue().id, {})
      .pipe(
        map((basket: IBasket) => {
          this.basketSource.next(basket);
        })
      );
  }

  setShippingPrice(deliveryMethod: IDeliveryMethod) {
    this.shipping = deliveryMethod.price;

    const basket = this.getCurrentBasketValue();
    basket.deliveryMethodId = deliveryMethod.id;
    basket.shippingPrice = deliveryMethod.price;

    this.calculateTotals();
    this.setBasket(basket);
  }

  getBasket(id: string): Observable<void> {
    return this.http.get<IBasket>(this.baseUrl + '/basket?id=' + id).pipe(
      map((basket: IBasket) => {
        this.basketSource.next(basket);
        this.shipping = basket.shippingPrice;
        this.calculateTotals();
      })
    );
  }

  setBasket(basket: IBasket): Subscription {
    return this.http.post<IBasket>(this.baseUrl + '/basket', basket).subscribe({
      next: (response: IBasket) => {
        this.basketSource.next(response)
        this.calculateTotals();
      },
      error: (e: HttpErrorResponse) => console.log(e)
    })
  }

  // Clean up method
  deleteLocalBasket(basketId: string) {
    this.basketSource.next(null);
    this.basketTotalSource.next(null);
    localStorage.removeItem('basket_id');
  }

  deleteBasket(basket: IBasket) {
    return this.http.delete<IBasket>(this.baseUrl + '/basket?id=' + basket.id).subscribe({
      next: () => {
        // Emit the null value for the basket
        this.basketSource.next(null),
          // Emit the null value for the basket totals
          this.basketTotalSource.next(null)
        // Remove the basket id key from localStorage
        localStorage.removeItem('basket_id');
      },
      error: (e: HttpErrorResponse) => console.log(e)
    })
  }

  getCurrentBasketValue(): IBasket {
    return this.basketSource.value;
  }

  addItemToBasket(item: IProduct, quantity = 1): void {
    const itemToAdd: IBasketItem = this.mapProductItemToBasketItem(item, quantity);

    // If there is no basket we obtain null, otherwise a basket. If null create a basket
    const basket = this.getCurrentBasketValue() ?? this.createBasket();

    // Add the item to the list of basket items.
    // Before doing this we need to check if the item is already available in the basket, if so quantity incremenets, if not item is added to the list of basket items
    basket.items = this.addOrUpdateBasketItem(basket.items, itemToAdd, quantity);

    // Make the API reauest and create/update the basket
    this.setBasket(basket);
  }

  incrementItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();

    // We know that the item will be found since it is already appearing on the page
    const foundItemIndex = basket.items.findIndex(i => i.id == item.id);

    // Increment the item's quantity
    basket.items[foundItemIndex].quantity++;

    // Make the API reauest and create/update the basket
    this.setBasket(basket);
  }

  decrementItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();

    // We know that the item will be found since it is already appearing on the page
    const foundItemIndex = basket.items.findIndex(x => x.id == item.id);

    // Increment the item's quantity
    // If the quantity is greater then one, decrement is possible, if not, remove the entire item from the basket
    if (basket.items[foundItemIndex].quantity > 1) {
      // Decrement
      basket.items[foundItemIndex].quantity--;
      // Make the API reauest and create/update the basket
      this.setBasket(basket);
    } else {
      this.removeItemFromBasket(item);
    }

  }

  removeItemFromBasket(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();

    // Remove the item from the basket
    if (basket.items.some(x => x.id === item.id)) {
      // return an array of all the items that do not match with the item's id
      basket.items = basket.items.filter(i => i.id !== item.id);

      // Check basket items length. If not greater then 0, delete the basket      
      if (basket.items.length > 0) {
        this.setBasket(basket)
      } else {
        this.deleteBasket(basket)
      }
    }
  }

  // Helper method
  private addOrUpdateBasketItem(items: IBasketItem[], itemToAdd: IBasketItem, quantity: number): IBasketItem[] {
    // index = -1 ==> item not found in the basket items
    // index != -1 ==> item found in the basket items, increase it's quantity
    const index = items.findIndex(i => i.id === itemToAdd.id)
    if (index === -1) {
      itemToAdd.quantity = quantity;
      items.push(itemToAdd);
    } else {
      items[index].quantity++;
    }

    return items;
  }

  // Helper method
  private createBasket(): IBasket {
    // Generate a basket with an uniaue identifier and an empty list of basket items
    const basket = new Basket();

    // The basket id of the current user need to be stored in local storage so that whenever the app starts, an api request can be made to obtain the user's basket
    localStorage.setItem('basket_id', basket.id);

    return basket;
  }

  // Helper method
  private mapProductItemToBasketItem(item: IProduct, quantity: number): IBasketItem {
    return {
      id: item.id,
      productName: item.name,
      price: item.price,
      pictureUrl: item.pictureUrl,
      quantity,
      brand: item.productBrand,
      type: item.productBrand
    }
  }

  private calculateTotals() {
    const basket = this.getCurrentBasketValue();
    const shipping = this.shipping;
    const subtotal = basket.items.reduce((a, b) => (b.price * b.quantity) + a, 0)
    const total = subtotal + shipping;
    this.basketTotalSource.next({ shipping, total, subtotal })
  }

}

