import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { LoaderService } from '../services/shared/loader.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  address = {
    name: '',
    company: '',
    address1: '',
    address2: '',
    city: '',
    postal_code: '',
    country: 'India',
    state: '',
    default: 'true'
  };
  userData: any;
  constructor(
    private authService: AuthService,
    private router: Router,
    private loaderService: LoaderService,
    private httpClient: HttpClient
  ) {}

  async ngOnInit() {
    this.userData = await this.getUserDetails();
    let address = JSON.parse(localStorage.getItem('address'));
    if (address && Object.keys(address)?.length) {
      address['mobile'] = this.userData.address.mobile;
      this.userData.address = address;
      this.address = address;
    }
  }

  async getUserDetails() {
    return new Promise(resolve => {
      this.loaderService.showLoading();
      this.authService.getUserDetails().subscribe(
        data => {
          this.loaderService.closeLoading();
          resolve(data['data']);
        },
        error => {
          console.log(error);
        }
      );
    });
  }

  async payNow() {
    const amt = this.authService.orderAmount.value.toString();
    let order: any = await this.authService.order.value;
    order.paymentMode = 'Paytm';
    order.address = this.address;
    const tempProduct = order.products[0];
    order.products = tempProduct;
    const orderGot: any = await this.httpClient
      .post('orders/add-order', order)
      .toPromise();
    const payload = {
      email: this.userData.email,
      phone: this.userData.address
        ? this.userData.address.mobile
        : '7777777777',
      amount: amt,
      userId: this.userData._id,
      orderId: orderGot.data._id
    };
    const res = await this.httpClient
      .post('paytm/payment', payload)
      .toPromise();
    this.post(res, 'https://securegw-stage.paytm.in/theia/processTransaction');
  }

  async payLater() {
    let order: any = await this.authService.order.value;
    order.paymentMode = 'cash on delivery';
    order.address = this.userData.address;
    const tempProduct = order.products[0];
    order.products = tempProduct;
    const orderGot: any = await this.httpClient
      .post('orders/add-order', order)
      .toPromise();
    console.log(orderGot);
    this.router.navigate([`/order-status/${orderGot.data._id}`]);
  }

  ngOnDestroy() {
    localStorage.removeItem('address');
  }

  post(obj, url) {
    var mapForm = document.createElement('form');
    //mapForm.target = "_blank";
    mapForm.method = 'GET'; // or "post" if appropriate
    mapForm.action = url;
    Object.keys(obj).forEach(function(param) {
      var mapInput = document.createElement('input');
      mapInput.type = 'hidden';
      mapInput.name = param;
      mapInput.setAttribute('value', obj[param]);
      console.log('--------', mapInput);
      mapForm.appendChild(mapInput);
    });
    document.body.appendChild(mapForm);
    mapForm.submit();
  }
}
