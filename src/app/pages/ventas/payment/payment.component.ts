import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../payment.service';

declare var Stripe: any; // Add this line to declare the Stripe variable

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  constructor(private paymentService: PaymentService) { }

  ngOnInit(): void {
  }

  makePayment(): void {
    const amount = 1000;
    this.paymentService.createCheckoutSession(amount)
     .then((response: any) => {
        const sessionId = response.id;
        const stripe = Stripe('pk_test_51Pb0tI2N50f3xlN2Yu218bz88PY5B8tZsAigCXQEqCdWisHn6vTzzT3stqW6rzumfmIVRZkSgKAmCGitMbwQEy0K00ILTTXvqV');
        stripe.redirectToCheckout({ sessionId: sessionId });
      })
     .catch((error: any) => console.error(error));
  }

}