import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { LoaderService } from '../services/shared/loader.service';
import { ToastService } from '../services/shared/toast.service';

@Component({
  selector: 'app-payment-response',
  templateUrl: './payment-response.component.html',
  styleUrls: ['./payment-response.component.css']
})
export class PaymentResponseComponent implements OnInit {
  orderId;
  paymentId;
  orderStatus = true;
  amount = 0;
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private httpClient: HttpClient,
    ) {}

  async ngOnInit() {
    this.paymentId = this.route.snapshot.url[1].path;
    let orderData: any = await this.httpClient.get(`orders/get-order/`+this.paymentId).toPromise();
    orderData = orderData['data']
    if (orderData && orderData.paymentMode == 'cash on delivery') {
      this.amount = parseInt(orderData.totalAmnt);
    } else {
      const orderDetails: any = await this.httpClient
      .get('paytm/payment-details/' + this.paymentId)
      .toPromise();
      this.orderStatus =
        orderDetails.paymentResult[0].STATUS == 'TXN_FAILURE' ? false : true;
      this.orderId = orderDetails.paymentResult[0].ORDERID;
      this.amount = orderDetails.paymentResult[0].TXNAMOUNT;      
    }
    this.removeCart();
  }

  removeCart() {
    this.authService.removeCartOrder().subscribe(
      () => {
        console.log('here')
      },
      error => {
        console.log(error);
      }
    );
  }

}
