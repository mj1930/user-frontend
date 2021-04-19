import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { ToastService } from '../services/shared/toast.service';

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
    productName: '',
    productId: '',
    quantity: 1,
    orderPrice: '',
    sellerId: ''
  };

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    let id: string;
    this.activatedRoute.params.subscribe(item => {
      id = item['id'];
    });
    this.getProduct(id);
  }

  getProduct(id) {
    let obj = {
      skip: 0,
      limit: 10,
      status: true
    };
    this.authService.getProduct(id).subscribe(
      data => {
        console.log(data);
        this.product = data['data'];
        this.authService.productId.next(this.product._id);
      },
      error => {
        console.log(error);
      }
    );
  }

  changeQuantity() {
    console.log('qqqq', this.quantity);
  }

  addToCart() {
    // this.router.navigateByUrl('/cart');
    let reqBody = {
      products: [
        {
          productImg: [],
          productName: '',
          productId: '',
          quantity: 1,
          orderPrice: '',
          sellerId: ''
        }
      ],
      totalAmnt: ''
    };
    //reqBody.products = [];
    // for(let i=0; i<this.quantity; i++) {
    //   this.reqBody.products.push(this.product);
    // }

    reqBody.products[0] = {
      productImg: [],
      productName: this.product.itemName,
      productId: this.product._id,
      quantity: this.quantity,
      orderPrice: this.product.mrp,
      sellerId: this.product.userId
    };
    console.log(reqBody);
    reqBody.totalAmnt = String(this.quantity * this.product.mrp);
    this.authService.addToCart(reqBody).subscribe(
      data => {
        //console.log(data);
        this.router.navigateByUrl('/cart');
        //this.product = data['data'];
      },
      error => {
        console.log(error);
      }
    );
  }

  onAddToCart() {
    let obj = {
      skip: 0,
      limit: 10
    };
    let response: any = [];
    this.authService.getCartList(obj).subscribe(
      (resp: any) => {
        response = resp;
        if (response.data.length === 0) {
          //call addTocart
          this.addToCart();
        } else {
          //update updateNewProductToCart() product totalamt
          let temp = [];
          response.data.map(item => {
            temp.push(item.products[0]);
          });

          console.log('temp----', temp);
          let totalAmt: number = 0;
          temp.map(item => {
            totalAmt = item.orderPrice * item.quantity + totalAmt;
          });

          const payload = {
            product: temp,
            totalAmnt: totalAmt
          };
          console.log('PAYYYYYYYYLOAD', payload);
          this.authService.updateNewProductToCart(payload).subscribe(
            (resp: any) => {
              this.toastService.openSnackbar(
                'Product added to cart successfully!!'
              );
              const productCount = resp.data.products.length.toString();
              this.authService.productCount.next(productCount);
            },
            error => {
              console.log(error);
            }
          );
        }

        //console.log('RESPONSE', response.data.length);
      },
      error => {
        console.log('ERROR', error);
      }
    );
  }
}
