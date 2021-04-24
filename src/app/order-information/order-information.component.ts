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
 // paymentMethod="Paytm"; Implemented once order model have this
  address : any;
  constructor(private route: ActivatedRoute ,private httpClient:HttpClient) {

  }

  async ngOnInit(){
    this.orderId= this.route.snapshot.url[1].path;
    const order:any= await this.httpClient.post('paytm/getOrderById',{"orderId":this.orderId}).toPromise();
    this.order=order;
    this.address=order.address;
    this.address=Object.values(this.address).reduce((prev:any, curr,index) =>{
      if(curr=="true" || curr =="false")
        return prev;
      return prev+curr+'<br>'
    });
    console.log(order);
    //this.paymentMethod= this.order.paymentResult[0].BANKNAME+ " " +this.order.paymentResult[0].PAYMENTMODE;
  }
 getOrderStatus(s){
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
  }
 }

}
