import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IOrder } from '../shared/models/order';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  baseUrl: string = environment.apiUrl;

  orders: IOrder[] = [];

  constructor(
    private http: HttpClient
  ) { }

  getOrdersForUser(): Observable<IOrder[]> {
    
    if(this.orders.length > 0) {
      return of(this.orders);
    }

    return this.http.get<IOrder[]>(this.baseUrl + '/orders')
      .pipe(
        map((response: IOrder[]) => {
          this.orders = response;
          return response;
        })
      );
  }

  getOrderDetailed(id: number): Observable<IOrder> {

    let order = this.orders.find(o => o.id === id);

    if(order) {
      return of(order);
    }

    return this.http.get<IOrder>(this.baseUrl + '/orders/' + id);
  }
}
