/* Standard Modules */
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

/* Custom Services */
import { BasketService } from 'src/app/basket/basket.service';
import { AccountService } from 'src/app/account/account.service';
import { IUser } from './shared/models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private basketService: BasketService,
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    this.loadBasket();
    this.loadCurrentUser();
  }
  
  loadBasket() {
    const basketId = localStorage.getItem('basket_id');
    if(basketId) {
      this.basketService.getBasket(basketId).subscribe({
        error: (e: HttpErrorResponse) => console.log(e)
      })
    }
  }

  loadCurrentUser() {
    const token = localStorage.getItem('token');
    this.accountService.loadCurrentUser(token).subscribe({
      error: (e) => console.log(e)
    });
  }
}
