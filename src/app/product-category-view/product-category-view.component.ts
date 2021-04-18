import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-product-category-view',
  templateUrl: './product-category-view.component.html',
  styleUrls: ['./product-category-view.component.css']
})
export class ProductCategoryViewComponent implements OnInit {

  categoryId: String = '';
  productList = [];
  categoryName: String = '';
  categories: any = [];
  showLocationDropdown = false;
  constructor(
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
   }

  ngOnInit(): void {
    this.getCategories();
    this.categoryId = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.categoryId) {
      this.getProducts();
      this.getCategory();
    } else {
      this.router.navigate(['']);
    }
  }

  getCategory() {
    this.authService.getOneCategory(this.categoryId).subscribe((res: any) => {
      this.categoryName = res.data.categoryName;
      if(this.categoryName === 'Food and Beverages') {
        this.showLocationDropdown = true;
      } else {
        this.showLocationDropdown = false;
      }
    });
  }

  getProducts() {
    let obj = {
      skip: 0,
      limit: 20,
      categoryId: this.categoryId
    }
    this.authService.getProductsByCategory(obj).subscribe((res: any) => {
      if (res.code === 200) {
        this.productList = res.data;
      }
    });
  }

  sortData(event) {
    console.log(event)
    let obj = {
      key: event.target.value ? event.target.value.split('-')[0] : "",
      sortBy: event.target.value ? (event.target.value.split('-')[1] === 'asc' ? "1" : "-1") : 0 ,
      skip: 0,
      limit: 100
    }
    this.authService.getSortProducts(obj).subscribe((res: any) => {
      if (res.code === 200) {
        this.productList = res.data;
      }
    });
  }

  getCategories() {
    let reqBody = {
      skip: 0,
      limit: 100
    };
    this.authService.getCategories(reqBody).subscribe(data => {
      this.categories = data['data'];
    }, error => {
      console.log(error);
    })
  }

  getProductByCity(event) {
    let reqBody = {
      skip: 0,
      limit: 100,
      city: event.target.value
    };
    this.authService.getProductsByCity(reqBody).subscribe(data => {
      this.productList = data['data'];
    }, error => {
      console.log(error);
    })
  }

}
