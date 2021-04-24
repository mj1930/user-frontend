import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  address={
    'name':'',
    'company':'',
    'address1':'',
    'address2':'',
    'city':'',
    'postal_code':'',
    'country':'India',
    'state':'',
    'default':'true'
  }
  userData: any;
  constructor(
    private authService: AuthService,
     private router: Router ,
     private httpClient : HttpClient
  ) { }

  async ngOnInit() {
    this.userData = await this.getUserDetails();
  }

  async getUserDetails() {
    return new Promise((resolve)=>{
      this.authService.getUserDetails().subscribe(data => {
        //console.log(data);
        //this.router.navigateByUrl("/address-information");
        resolve(data['data']);
      }, error => {
        console.log(error);
      })
    })
  }

  async payNow() {
    const amt = this.authService.orderAmount.value.toString();
    let order:any = await this.authService.order.value;
    order.address = this.address;

    const orderGot:any = await this.httpClient.post('orders/add-order',order).toPromise();
    const payload = {
      "email": this.userData.email,
      "phone": this.userData.address.mobile,
      "amount": amt,
      "userId": this.userData._id,
      "orderId": orderGot.data._id
    };
    const res = await this.httpClient.post("paytm/payment", payload).toPromise();
    this.post(res, "https://securegw-stage.paytm.in/theia/processTransaction");
  }

  async payLater() {
    const amt = this.authService.orderAmount.value.toString();
    let order:any = await this.authService.order.value;
    order.address = this.address;

    const orderGot : any = await this.httpClient.post('orders/add-order',order).toPromise();
    console.log(orderGot);
    this.router.navigate([`/order-status/${orderGot.data._id}`])
  }

  post(obj, url) {
    var mapForm = document.createElement("form");
    //mapForm.target = "_blank";
    mapForm.method = "GET"; // or "post" if appropriate
    mapForm.action = url;
    Object.keys(obj).forEach(function (param) {
      var mapInput = document.createElement("input");
      mapInput.type = "hidden";
      mapInput.name = param;
      mapInput.setAttribute("value", obj[param]);
      mapForm.appendChild(mapInput);
    });
    document.body.appendChild(mapForm);
    mapForm.submit();
  }

}
