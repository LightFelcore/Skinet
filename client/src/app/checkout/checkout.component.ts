import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountService } from '../account/account.service';
import { BasketService } from '../basket/basket.service';
import { IAddress } from '../shared/models/address';
import { IBasketTotals } from '../shared/models/basket';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  checkoutForm: FormGroup;
  basketTotals$: Observable<IBasketTotals>;

  constructor(
    private accountService: AccountService,
    private basketService: BasketService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.checkBasketAvailability();
    this.createCheckoutForm();
    this.getAddressFormValues();
    this.getDeliveryMethodValue();
    
    this.basketTotals$ = this.basketService.basketTotal$;
  }

  checkBasketAvailability() {
    if(this.basketService.getCurrentBasketValue() === null) {
      this.router.navigateByUrl('/shop');
    }
  }

  getAddressFormValues() {
    this.accountService.getUserAddress().subscribe({
      next: (address: IAddress) => {
        if (address) {
          this.checkoutForm.get('addressForm').patchValue(address);
        }
      },
      error: (e) => console.log(e)
    })
  }

  // This method is used to set the deliveryMethod in order that when the user comes back to the delivery method step, it is still selected
  getDeliveryMethodValue() {
    // Get the basket
    const basket = this.basketService.getCurrentBasketValue();
    
    // Check to see if there is already a deliverymethod set
    if(basket.deliveryMethodId !== null) {
      this.checkoutForm.get('deliveryForm').get('deliveryMethod').patchValue(basket.deliveryMethodId.toString());
    }
  }

  createCheckoutForm() {
    this.checkoutForm = this.fb.group({
      addressForm: this.fb.group({
        firstName: [null, Validators.required],
        lastName: [null, Validators.required],
        street: [null, Validators.required],
        city: [null, Validators.required],
        state: [null, Validators.required],
        zipCode: [null, Validators.required],
      }),
      deliveryForm: this.fb.group({
        deliveryMethod: [null, Validators.required]
      }),
      paymentForm: this.fb.group({
        nameOnCard: [null, Validators.required]
      })
    });
  }

}
