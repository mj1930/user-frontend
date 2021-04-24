import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  term = '';
  searchResult = [];
  showSearchResultSection = false;
  categories = [];
  searchSubject = new Subject<any>();
  filteredList$: any;
  productCount: any;
  isAuthenticated: boolean = false;
  dataResponse: any;
  totalAmout: any = 0;
  name: string;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    let user = JSON.parse(localStorage.getItem('user'));
    this.name = user ? user.fname + " " + user.lname : '';
    this.getAuthenticatedUser();
    this.getProductCount();
    this.updatedProductCount();
    this.getCategories();
    this.searchSubject
      .pipe(
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe(d => {
        console.log(d);
        this.onSearchProduct(d);
      });
  }

  getCategories() {
    let reqBody = {
      skip: 0,
      limit: 100
    };
    this.authService.getCategories(reqBody).subscribe(
      data => {
        this.categories = data['data'];
      },
      error => {
        console.log(error);
      }
    );
  }

  getSearchValue($event: any) {
    const value = $event.target.value;
    this.searchSubject.next(value);
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }

  onSearchProduct(searchValue) {
    if (searchValue === '') {
      console.log('searchResult', this.searchResult);
      this.searchResult = [];
    }
    this.authService.searchProduct(searchValue).subscribe(resp => {
      this.searchResult = resp['data'];
      this.showSearchResultSection = true;
    });
  }

  getProductCount() {
    let obj = {
      skip: 0,
      limit: 10
    };
    this.authService.getCartList(obj).subscribe((resp: any) => {
      this.dataResponse = resp.data[0].products;
      this.dataResponse.map(item => {
        this.totalAmout = this.totalAmout + +item.orderPrice;
      });
      this.productCount = localStorage.getItem('user')
        ? resp.data[0].products.length
        : '';
    });
  }

  updatedProductCount() {
    this.authService.productData.subscribe(data => {
      this.dataResponse = localStorage.getItem('user') ? data : '';
    });

    this.authService.productCount.subscribe(count => {
      this.productCount = localStorage.getItem('user') ? count : '';
    });

    this.authService.totalPrice.subscribe(totalPrice => {
      this.totalAmout = localStorage.getItem('user') ? totalPrice : '';
    });
  }

  searchProduct() {
    // this.authService.searchProduct(this.term).subscribe(
    //   data => {
    //     console.log(data);
    //     this.searchResult = data['data'];
    //     this.showSearchResultSection = true;
    //   },
    //   error => {
    //     console.log(error);
    //   }
    // );
  }

  setProductSearchText(id) {
    this.router.navigate(['product-description', id]);
  }

  getAuthenticatedUser() {
    this.isAuthenticated = localStorage.getItem('user') ? true : false;
  }
}
