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
  mrpTotal = 0;
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

  calculateDiscount(price1, price2) {
    return Math.round(100 - (price2/price1) * 100);
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
      (resp: any)  => {
        let tempAmount = 0;
        let tempMrpAmount = 0;
        resp.data.products.map(item => {
          tempAmount = (tempAmount + item.orderPrice) * item.quantity;
          tempMrpAmount = (tempMrpAmount + item.mrp) * item.quantity;
        });
        this.authService.totalPrice.next(tempAmount);
        this.authService.totalMrp.next(tempMrpAmount);
        this.authService.productData.next(resp.data.products);
        const productCount = resp.data.products.length.toString();
        this.authService.productCount.next(productCount);
        this.loaderService.closeLoading();
        this.getCartList();
      },
      error => {
        console.log(error);
      }
    );
  }

  removeCart(product) {
    product.quantity -= 1;
    let reqBody = {
      productId: product.productId,
      quantity: 1,
      totalAmnt: product.orderPrice * product.quantity
    };
    this.loaderService.showLoading();
    this.authService.removeCart(reqBody).subscribe(
      (resp: any) => {
        let tempAmount = 0;
        let tempMrpAmount = 0;
        resp.data.products.map(item => {
          tempAmount = (tempAmount + item.orderPrice) * item.quantity;
          tempMrpAmount = (tempMrpAmount + item.mrp) * item.quantity;
        });
        this.authService.totalPrice.next(tempAmount);
        this.authService.totalMrp.next(tempMrpAmount);
        this.authService.productData.next(resp.data.products);
        const productCount = resp.data.products.length.toString();
        this.authService.productCount.next(productCount);
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
    this.mrpTotal = 0;
    this.cartList.forEach(cart =>
      cart['products'].forEach(item => {
        this.subTotal += item.quantity * item.orderPrice;
        this.mrpTotal += item.quantity * item.mrp;
      })
    );
    this.total = this.subTotal;
  }

  async checkout() {
    this.authService.orderAmount.next(this.total);
    let productArr = await this.cartList.map((cart)=>cart.products);

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
