import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-user-cart',
  templateUrl: './user-cart.component.html',
  styleUrls: ['./user-cart.component.css']
})
export class UserCartComponent implements OnInit {
  cartList = [];
  // quantity = null;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.getCartList();
  }

  getCartList() {
    let obj = {
      skip: 0,
      limit: 10
    }
    this.authService.getCartList(obj).subscribe(data => {
      console.log(data);
      this.cartList = data['data'];
      this.cartList.forEach(item => item['quantity'] = item.products.length);
      this.calculateTotal();
    }, error => {
      console.log(error);
    });
  }

  updateCart(cart, index) {
    let reqBody = {
      productId: cart.products[index]._id,
      quantity: cart.quantity,
      totalAmnt: String(cart.products[0].mrp * cart.quantity),
          };
    this.authService.updateCart(reqBody).subscribe(data => {
      console.log('update',data);
      this.getCartList();
      // for(let i=0; i<this.cartList.length; i++) {
      //   if(data["data"]._id === this.cartList[i]._id) {
      //     this.cartList[i] = data['data'];
      //     this.cartList[i]["quantity"] = data['data']["products"].length;
      //   }
      // }
    }, error => {
      console.log(error);
    });
  }

  removeCart(cart, index) {
    let reqBody = {
productId: cart.products[index]._id,
quantity: cart.quantity,
totalAmnt: String(cart.products[0].mrp * cart.quantity),
    };
    this.authService.removeCart(reqBody).subscribe(data => {
      console.log('remove',data);
      this.getCartList();
      // for(let i=0; i<this.cartList.length; i++) {
      //   if(data["data"]._id === this.cartList[i]._id) {
      //     this.cartList[i] = data['data'];
      //     this.cartList[i]["quantity"] = data['data']["products"].length;
      //   }
      // }
    }, error => {
      console.log(error);
    });
  }
subTotal = 0;
total = null;
gstValue = null;
  calculateTotal() {
    this.subTotal = 0;
    this.cartList.forEach(item => {
this.subTotal += item.quantity * item.products[0].mrp;
    });
    this.gstValue = this.subTotal * 18 / 100;
    this.total = this.subTotal + this.gstValue;
  }

}
