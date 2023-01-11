import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket } from 'src/app/shared/models/basket';
import { CheckoutService } from '../checkout.service';

declare var Stripe;

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent implements AfterViewInit, OnDestroy {

  // Stripe properties need to be of type any because stipe is Vanilla JS which means no typescript
  stripe: any;
  cardNumber: any;
  cardExpiry: any;
  cardCvc: any;
  cardErrors: any;
  cardHandler = this.onChange.bind(this);
  loading = false;

  // Validation Properties
  cardNumberValid: boolean = false;
  cardExpiryValid: boolean = false;
  cardCvcValid: boolean = false;

  @ViewChild('cardNumber', { static: true }) cardNumberElement: ElementRef;
  @ViewChild('cardExpiry', { static: true }) cardExpiryElement: ElementRef;
  @ViewChild('cardCvc', { static: true }) cardCvcElement: ElementRef;

  @Input() checkoutForm: FormGroup;

  constructor(
    private basketService: BasketService,
    private checkoutService: CheckoutService,
    private toastrService: ToastrService,
    private router: Router
  ) { }


  ngAfterViewInit(): void {
    this.stripe = Stripe('pk_test_51MOm2WEL38kybIuEIt7Vzk3yGCAeII4PhmeCl1ET3vMGpNoiNWIgKQMUgaMjh2eaeOSGlMtimnhURadePNkSylOv00IRGJEt5H');
    const elements = this.stripe.elements();

    // Card Number
    this.cardNumber = elements.create('cardNumber');
    this.cardNumber.mount(this.cardNumberElement.nativeElement);
    this.cardNumber.addEventListener('change', this.cardHandler);

    // Card Expiry
    this.cardExpiry = elements.create('cardExpiry');
    this.cardExpiry.mount(this.cardExpiryElement.nativeElement);
    this.cardExpiry.addEventListener('change', this.cardHandler);

    // Crard Cvc
    this.cardCvc = elements.create('cardCvc');
    this.cardCvc.mount(this.cardCvcElement.nativeElement);
    this.cardCvc.addEventListener('change', this.cardHandler);
  }

  ngOnDestroy(): void {
    this.cardNumber.destroy();
    this.cardExpiry.destroy();
    this.cardCvc.destroy();
  }

  // The onChange method will recieve an object as parameter. We filter the error prop directly in the parameter by using destructuring
  onChange(event: any) {

    if (event.error) {
      this.cardErrors = event.error.message;
    } else {
      this.cardErrors = null;
    }

    switch (event.elementType) {
      case 'cardNumber':
        this.cardNumberValid = event.complete;
        break;

      case 'cardExpiry':
        this.cardExpiryValid = event.complete;
        break;

      case 'cardCvc':
      	this.cardCvcValid = event.complete;
        break;

      default:
        break;
    }
  }

  async submitOrder() {
    // Set the loading to true
    this.loading = true;

    // Get the basket
    const basket = this.basketService.getCurrentBasketValue();

    try {
      // Create the order
      const createdOrder = await this.createOrder(basket);

      // Get the payment results from Stripe
      const paymentResult = await this.confirmPaymentWithStripe(basket);

      if (paymentResult.paymentIntent) {

        // Delete the basket
        this.basketService.deleteBasket(basket);

        // Navigate with navigation extras
        const navigationExtras: NavigationExtras = { state: createdOrder }
        this.router.navigate(['/checkout/success'], navigationExtras);

      } else {
        this.toastrService.error(paymentResult.error.message);
      }

      // Set the loading to false
      this.loading = false;

    } catch (error) {
      // Set the loading to false
      this.loading = false;
      console.log(error)
    }
  }

  private async confirmPaymentWithStripe(basket: IBasket) {
    return this.stripe.confirmCardPayment(basket.clientSecret, {
      payment_method: {
        card: this.cardNumber,
        billing_details: {
          name: this.checkoutForm.get('paymentForm').get('nameOnCard').value
        }
      }
    });
  }

  private async createOrder(basket: IBasket) {
    // Convert the basket data in an order object
    const orderToCreate = this.getOrderToCreate(basket);
    return lastValueFrom(this.checkoutService.createOrder(orderToCreate))
  }

  // Helper method
  private getOrderToCreate(basket: IBasket) {
    return {
      basketId: basket.id,
      deliveryMethodId: +this.checkoutForm.get('deliveryForm').get('deliveryMethod').value,
      shipToAddress: this.checkoutForm.get('addressForm').value
    }
  }
}
