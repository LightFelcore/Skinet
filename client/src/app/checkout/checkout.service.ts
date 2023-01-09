import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

/* Custom Interfaces */
import { IDeliveryMethod } from '../shared/models/deliveryMethod';
import { IOrder, IOrderToCreate } from '../shared/models/order';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  baseUrl: string = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  getDeliveryMethods() {
    return this.http.get(this.baseUrl + '/orders/deliveryMethods').pipe(
      map((dm: IDeliveryMethod[]) => {
        // Sort the delivery methods by highest price first
        return dm.sort((a,b) => b.price - a.price);
      })
    )
  }

  createOrder(order: IOrderToCreate): Observable<IOrder> {
    return this.http.post<IOrder>(this.baseUrl + '/orders', order);
  }

}
