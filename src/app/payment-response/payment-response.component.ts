import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
  constructor(private route: ActivatedRoute, private httpClient: HttpClient) {}

  async ngOnInit() {
    this.paymentId = this.route.snapshot.url[1].path;
    console.log('payment', this.paymentId);
    //get Order Status
    const orderDetails: any = await this.httpClient
      .get('paytm/payment-details/' + this.paymentId)
      .toPromise();
    console.log(orderDetails);
    this.orderStatus =
      orderDetails.paymentResult[0].STATUS == 'TXN_FAILURE' ? false : true;
    this.orderId = orderDetails.paymentResult[0].ORDERID;
    this.amount = orderDetails.paymentResult[0].TXNAMOUNT;
  }
}
