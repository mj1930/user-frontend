import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { LoaderService } from '../services/shared/loader.service';
import { ToastService } from '../services/shared/toast.service';
import * as $ from 'jquery';

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
  getRelatedProduct: any = [];
  ratings: any = [];
  vinProducts: any = [];
  productId: any;
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
      this.productId = id;
    });
    this.getProduct(id);
    this.getRatings();
  }

  getVinProducts() {
    let vin = this.product.vin ? this.product.vin : '';
    this.authService.getVinProducts(vin).subscribe((resp: any) => {
      if (resp.code === 200) {
        this.vinProducts = resp['data'];
        let index = this.getRelatedProduct.findIndex(pr => pr._id = this.productId);
        this.getRelatedProduct.splice(index, 1)
      }
    })
  }

  updateCart(isFromBuy= false) {
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
        if (isFromBuy) {
          this.router.navigate(['/cart']);
        } else {
          this.toastService.openSnackbar(
            'Product added to cart successfully!!'
          );
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  changeQuantity() {
    console.log('qqqq', this.quantity);
  }

  calculateDiscount(price1, price2) {
    return Math.round(100 - (price2/price1) * 100);
  }
  
  getRating(rating) {
    return Math.ceil((rating * 2))
  }

  getProduct(id) {
    this.loaderService.showLoading();
    this.authService.getProduct(id).subscribe(
      data => {
        this.loaderService.closeLoading();
        this.product = data['data'];
        let obj = {
          categoryId: this.product.categoryId,
          itemName: this.product.itemName
        }
        this.authService.getRelatedProduct(obj).subscribe((data: any) => {
          if (data.code === 200) {
            this.getRelatedProduct = data['data'];
            this.getVinProducts();
            let index = this.getRelatedProduct.findIndex(pr => pr._id = id);
            this.getRelatedProduct.splice(index, 1)
          }
        })
        this.authService.productId.next(this.product._id);
      },
      error => {
        console.log(error);
      }
    );
  }

  returnArray(val) {
    return Array.from({length: val},(v,k) => k+1);
  }

  returnBulletPoints(bulletPoints) {
    if (bulletPoints) {
      let bulletArray = bulletPoints.split("\n");
      return bulletArray;
    }
  }

  addToCart() {
    if (!this.quantity) {
      this.toastService.openSnackbar("Min 1 quantity needed");
      return
    }
    if (this.quantity > this.product.availableUnits) {
      this.toastService.openSnackbar("Cannot buy quantity more than available quantity");
      return;
    }
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
            sellerId: '',
            mrp: '',
            city: ''
          }
        ],
        totalAmnt: ''
      };
  
      reqBody.products[0] = {
        productImg: this.product.productImg,
        productName: this.product.itemName,
        productId: this.product._id,
        quantity: this.quantity,
        orderPrice: this.product.productPrice,
        mrp: this.product.mrp,
        sellerId: this.product.userId,
        city: this.product.city
      };
      reqBody.totalAmnt = String(this.quantity * this.product.mrp);
      this.loaderService.showLoading();
      this.authService.getCartList({
        skip: 0,
        limit: 10
      }).subscribe((resp: any) => {
        this.loaderService.closeLoading()
        if (resp['data'] && resp['data'].length > 0) {
          let temp = [];
          resp.data.map(item => {
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
              orderPrice: this.product.productPrice,
              mrp: this.product.mrp,
              sellerId: this.product.userId,
              city: this.product.city
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
            this.updateCart(isFromBuy)
          }
        } else {
          this.authService.addToCart(reqBody).subscribe(
            (resp: any) => {
              let tempAmount = 0;
              resp.data.products.map(item => {
                tempAmount = tempAmount + +item.orderPrice;
              });
              this.authService.totalPrice.next(tempAmount);
              this.authService.productData.next(resp.data.products);
              const productCount = resp.data.products.length.toString();
              this.authService.productCount.next(productCount);
              this.loaderService.closeLoading();
              if (isFromBuy) {
                this.router.navigateByUrl('/cart');
              }
            },
            error => {
              console.log(error);
            }
          );
        }
      })
    } else {
      this.router.navigate(['/login']);
    }
  }

  onAddToCart(product: any = {}) {
    let token = sessionStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
    }
    if (Object.keys(product)?.length) {
      this.product = product;
    }
    if (!this.quantity) {
      this.toastService.openSnackbar("Min 1 quantity needed");
      return
    }
    if (this.quantity > this.product.availableUnits) {
      this.toastService.openSnackbar("Cannot buy quantity more than available quantity");
      return;
    }
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
              orderPrice: this.product.productPrice,
              mrp: this.product.mrp,
              sellerId: this.product.userId,
              city: this.product.city
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

  getRatings() {
    this.authService.getProductRating(this.productId).subscribe((data: any) => {
      if (data.code === 200) {
        this.ratings = data['data'];
      }
    })
  }

  interChange(location) {
    let b = this.product.productImg[0];
    this.product.productImg[0] = this.product.productImg[location];
    this.product.productImg[location] = b;
  }

  getLowest(array) {
    let smallest = this.vinProducts[0].productPrice;
    array.forEach(item => {
      if (item.productPrice < smallest) {
        smallest = item.productPrice;
      }
    });
    return smallest;
  }
}
