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

    reqBody.products[0] = {
      productImg: this.product.productImg,
      productName: this.product.itemName,
      productId: this.product._id,
      quantity: this.quantity,
      orderPrice: this.product.mrp,
      sellerId: this.product.userId
    };
    reqBody.totalAmnt = String(this.quantity * this.product.mrp);
    this.authService.addToCart(reqBody).subscribe(
      () => {
        this.router.navigateByUrl('/cart');
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
            if (item)
              temp.push(item.products[0]);
          });
          let totalAmt: number = 0;
          temp.map(item => {
            totalAmt = item.orderPrice * item.quantity + totalAmt;
          });

          const payload = {
            product: temp,
            totalAmnt: totalAmt
          };
          this.authService.updateNewProductToCart(payload).subscribe(
            (resp: any) => {
              this.toastService.openSnackbar(
                'Product added to cart successfully!!'
              );
              let tempAmount = 0;
              resp.data.products.map(item => {
                tempAmount = tempAmount + +item.orderPrice;
              });
              this.authService.totalPrice.next(tempAmount);
              this.authService.productData.next(resp.data.products);
              const productCount = resp.data.products.length.toString();
              this.authService.productCount.next(productCount);
            },
            error => {
              console.log(error);
            }
          );
        }
      },
      error => {
        console.log('ERROR', error);
      }
    );
  }
}
