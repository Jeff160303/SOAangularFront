import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private apiUrl = 'http://localhost:8050/api/payments';

  constructor(private http: HttpClient) { }

  async createCheckoutSession(amount: number): Promise<any> {
    return lastValueFrom(this.http.post(`${this.apiUrl}/create-checkout-session`, { amount }));
  }

}