import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-product-description',
  templateUrl: './product-description.component.html',
  styleUrls: ['./product-description.component.css']
})
export class ProductDescriptionComponent implements OnInit {
  product: any;
  quantity = 1;
  reqBody = {
  productImg: [],
  productName: "",
  productId: "",
  quantity: 1,
  orderPrice: "",
  sellerId: ""
  };


  constructor(private authService: AuthService, private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    let id: string;
    this.activatedRoute.params.subscribe(item =>{
id = item['id'];
    });
    this.getProduct(id);
  }

  getProduct(id) {
    let obj = {
      skip: 0,
      limit: 10,
      status: true
    }
    this.authService.getProduct(id).subscribe(data => {
      console.log(data);
      this.product = data['data'];
    }, error => {
      console.log(error);
    });
  }

  changeQuantity() {
    console.log('qqqq', this.quantity);
    

  }

  addToCart() {
    let reqBody = {
      products:[{
      productImg: [],
      productName: "",
      productId: "",
      quantity: 1,
      orderPrice: "",
      sellerId: ""
      }],
    totalAmnt: ""};
    //reqBody.products = [];
    // for(let i=0; i<this.quantity; i++) {
    //   this.reqBody.products.push(this.product);
    // }

    reqBody.products[0]= {
      productImg: [],
      productName: this.product.itemName,
      productId: this.product._id,
      quantity: this.quantity,
      orderPrice: this.product.mrp,
      sellerId: this.product.userId
    }
    reqBody.totalAmnt = String(this.quantity * this.product.mrp);
    this.authService.addToCart(reqBody).subscribe(data => {
      //console.log(data);
      this.router.navigateByUrl("/cart");
      //this.product = data['data'];
    }, error => {
      console.log(error);
    })
  }

}
