import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { delay, finalize, Observable } from 'rxjs';
import { BusyService } from '../services/busy.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(
    private busyService: BusyService
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    // Turn of the loading spinner when making a post request for orders (submitting an order)
    if (request.method === 'POST' && request.url.includes('orders')) {
      return next.handle(request);
    }

    // Turn of the loading spinner when making a delete request for orders (when success page is showed the loading will turn on when the basket is being deleted)
    if(request.method === 'DELETE') {
      return next.handle(request);
    }

    // Turn off the loading spinner when asynchronous email check is busy on the backend
    if (request.url.includes('emailExists')) {
      return next.handle(request);
    }

    // Loading..
    this.busyService.busy()

    return next.handle(request).pipe(
      delay(1000),
      finalize(() => {
        this.busyService.idle()
      })
    );
  }
}
