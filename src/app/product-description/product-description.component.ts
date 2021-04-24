import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { LoaderService } from '../services/shared/loader.service';
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
    private loaderService : LoaderService,
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
    this.loaderService.showLoading();
    this.authService.getProduct(id).subscribe(
      data => {
        this.loaderService.closeLoading();
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
    this.router.navigateByUrl('/cart');
  }

  addDataToCart() {
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
      productImg: [],
      productName: this.product.itemName,
      productId: this.product._id,
      quantity: this.quantity,
      orderPrice: this.product.mrp,
      sellerId: this.product.userId
    };
    reqBody.totalAmnt = String(this.quantity * this.product.mrp);
    this.loaderService.showLoading();
    this.authService.addToCart(reqBody).subscribe(
      () => {
        this.loaderService.closeLoading();
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
    this.loaderService.showLoading();
    this.authService.getCartList(obj).subscribe(
      (resp: any) => {
        this.loaderService.closeLoading();
        response = resp;
        if (response.data.length === 0) {
          //call addTocart
          this.addDataToCart();
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
