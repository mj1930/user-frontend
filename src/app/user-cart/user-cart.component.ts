import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-user-cart',
  templateUrl: './user-cart.component.html',
  styleUrls: ['./user-cart.component.css']
})
export class UserCartComponent implements OnInit {
  cartList = [];
  // quantity = null;
  subTotal = 0;
  total = null;
  gstValue = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.getCartList();
  }

  getCartList() {
    let obj = {
      skip: 0,
      limit: 10
    };
    this.authService.getCartList(obj).subscribe(
      data => {
        console.log(data);
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
    this.authService.updateCart(reqBody).subscribe(
      data => {
        console.log('update', data);
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
    console.log(product, index);
    let reqBody = {
      productId: product.productId,
      quantity: product.quantity,
      totalAmnt: product.orderPrice * product.quantity
    };
    this.authService.removeCart(reqBody).subscribe(
      data => {
        console.log('remove', data);
        this.getCartList();
        //this.calculateTotal();
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

  checkout() {
    this.router.navigateByUrl('/address-information');
  }
}
