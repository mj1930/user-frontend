import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order-information',
  templateUrl: './order-information.component.html',
  styleUrls: ['./order-information.component.css']
})
export class OrderInformationComponent implements OnInit {
  orderId;
  order;
  rating: number = 0;
  currentRate: any = 0;
  feedback: string;
  isFeedBackGiven: false;
 // paymentMethod="Paytm"; Implemented once order model have this
  address : any;
  constructor(private route: ActivatedRoute ,private httpClient:HttpClient) {

  }

  async ngOnInit() {
    this.orderId = this.route.snapshot.url[1].path;
    const order:any = await this.httpClient.get('orders/get-order/'+this.orderId).toPromise();
    this.order = order.data;
    this.isFeedBackGiven = this.order.isFeedBackGiven;
    this.address = this.order.address;
  }
  
  getOrderStatus(s) {
    switch(s) {
      case 'P' :
        return "Pending";
        break;
      case 'D' :
        return "Dispatched";
        break;
        case 'RF' :
        return "Refunded";
        break;
        case 'RT' :
        return "Returned";
        break;
        case 'C' :
        return "Cancelled";
        break;
        case 'DL' :
        return "Delivered";
        break;
    }
  }

  addRating(value) {
    this.rating = value;
  }

  async submitFeedback() {
    let productId = this.order?.products[0].productId;
    let obj = {
      rating: this.rating,
      feedback: this.feedback,
      productId,
      orderId: this.orderId
    };
    let data: any = await this.httpClient.post('orders/rate-product', obj).toPromise();
    if (data.code === 200) {
      this.isFeedBackGiven = data['data'].isFeedBackGiven;
    }
  }
  
}
