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

  updateCart() {
    let product = this.product
    let reqBody = {
      productId: product._id,
      quantity: this.quantity,
      totalAmnt: String(parseInt(product.mrp) * this.quantity)
    };
    this.loaderService.showLoading();
    this.authService.updateCart(reqBody).subscribe(
      () => {
        this.loaderService.closeLoading();
        this.toastService.openSnackbar(
          'Product added to cart successfully!!'
        );
      },
      error => {
        console.log(error);
      }
    );
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
    this.addDataToCart(true);
  }

  addDataToCart(isFromBuy= false) {
    let token = sessionStorage.getItem('token');
    if (token) {
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
      this.loaderService.showLoading();
      this.authService.addToCart(reqBody).subscribe(
        () => {
          this.loaderService.closeLoading();
          if (isFromBuy) {
            this.router.navigateByUrl('/cart');
          }
        },
        error => {
          console.log(error);
        }
      );
    } else {
      this.router.navigate(['/login'])
    }
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
          let productAvailable = temp.filter((res) => {
            if (res.productId == this.product._id) return res;
          });
          if (productAvailable.length == 0) {
            let productData = [{
              productImg: this.product.productImg,
              productName: this.product.itemName,
              productId: this.product._id,
              quantity: this.quantity,
              orderPrice: this.product.mrp,
              sellerId: this.product.userId
            }]
            let totalAmt: number = 0;
            temp.map(item => {
              totalAmt = item.orderPrice * item.quantity + totalAmt;
            });
            totalAmt += parseInt(this.product.mrp);
            const payload = {
              product: productData,
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
          } else {
            this.updateCart()
          }
          
        }
      },
      error => {
        console.log('ERROR', error);
      }
    );
  }
}
