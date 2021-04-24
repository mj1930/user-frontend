import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { LoaderService } from '../services/shared/loader.service';
import { ToastService } from '../services/shared/toast.service';

@Component({
  selector: 'app-user-cart',
  templateUrl: './user-cart.component.html',
  styleUrls: ['./user-cart.component.css']
})
export class UserCartComponent implements OnInit {
  cartList = [];
  imgDefault = 'http://opencart.templatemela.com/OPC10/OPC100240/OPC2/image/cache/catalog/11-60x70.jpg';
  // quantity = null;
  subTotal = 0;
  total = null;
  gstValue = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loaderService : LoaderService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.getCartList();
  }

  getCartList() {
    let obj = {
      skip: 0,
      limit: 10
    };
    this.loaderService.showLoading();
    this.authService.getCartList(obj).subscribe(
      data => {
        this.loaderService.closeLoading();
        this.cartList = data['data'];

        //this.cartList.forEach(item => item['quantity'] = item.products.length);
        this.calculateTotal();
      },
      error => {
        console.log(error);
      }
    );
  }

  updateCart(product, index) {
    let reqBody = {
      productId: product.productId,
      quantity: product.quantity,
      totalAmnt: String(product.orderPrice * product.quantity)
    };
    this.loaderService.showLoading();
    this.authService.updateCart(reqBody).subscribe(
      data => {
        this.loaderService.closeLoading();
        this.getCartList();
        this.calculateTotal();
        // for(let i=0; i<this.cartList.length; i++) {
        //   if(data["data"]._id === this.cartList[i]._id) {
        //     this.cartList[i] = data['data'];
        //     this.cartList[i]["quantity"] = data['data']["products"].length;
        //   }
        // }
      },
      error => {
        console.log(error);
      }
    );
  }

  removeCart(product, index) {
    let reqBody = {
      productId: product.productId,
      quantity: product.quantity,
      totalAmnt: product.orderPrice * product.quantity
    };
    this.loaderService.showLoading();
    this.authService.removeCart(reqBody).subscribe(
      () => {
        this.loaderService.closeLoading();
        this.toastService.openSnackbar('Item removed successfully!!');
        this.getCartList();
      },
      error => {
        console.log(error);
      }
    );
  }

  calculateTotal() {
    this.subTotal = 0;
    this.cartList.forEach(cart =>
      cart['products'].forEach(item => {
        this.subTotal += item.quantity * item.orderPrice;
      })
    );
    this.gstValue = (this.subTotal * 18) / 100;
    this.total = this.subTotal + this.gstValue;
  }

  async checkout() {
    this.authService.orderAmount.next(this.total);
    let productArr=await this.cartList.map((cart)=>cart.products);

    this.authService.order.next({
      "products":productArr,
      "totalAmnt":("" + this.total).toString(),
      "address":{},
      "userGstin":" ",
      "businessName":" ",
      "paymentMode":"",
    });

    this.router.navigateByUrl('/address-information');
  }

}
