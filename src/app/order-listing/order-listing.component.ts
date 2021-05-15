import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { LoaderService } from '../services/shared/loader.service';

@Component({
  selector: 'app-order-listing',
  templateUrl: './order-listing.component.html',
  styleUrls: ['./order-listing.component.css']
})
export class OrderListingComponent implements OnInit {

  orders = [];
  orderStatuses = [
    {text: 'Pending', value: 'P'},
    {text: 'Dispatched', value: 'D'},
    {text: 'Refunded', value: 'RF'},
    {text: 'Cancelled', value: 'C'},
    {text: 'Returned', value: 'RT'}
  ];
  constructor(private authService: AuthService, private loaderService : LoaderService) { }

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders() {
    let reqBody = {
      skip: 0,
      limit: 10000
    };
    this.loaderService.showLoading();
    this.authService.getOrders(reqBody).subscribe(data => {
      this.loaderService.closeLoading();
      this.orders = data['data']['orders'];
      this.orders.forEach(item => {
        item['customerName'] =  data['data']['name'];
      })
      this.setOrderStaus();

    }, error => {
      
      console.log(error);
    })
  }

  setOrderStaus() {
    this.orders.forEach(item => {
      switch(item.orderStatus ) {
        case 'P' :
          item['status'] = "Pending";
          break;
        case 'D' :
          item['status'] = "Dispatched";
          break;
          case 'RF' :
          item['status'] = "Refunded";
          break;
          case 'RT' :
          item['status'] = "Returned";
          break;
          case 'C' :
          item['status'] = "Cancelled";
          break;
          case 'DL' :
          item['status'] = "Delivered";
          break;
      }
      
    })
  }

}
