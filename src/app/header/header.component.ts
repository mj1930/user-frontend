import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { LoaderService } from '../services/shared/loader.service';
import { $ } from 'protractor';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
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
  hideLoader = false;
  searchTerm: string = '';
  imgLink: string =
    'https://martialartsplusinc.com/wp-content/uploads/2017/04/default-image.jpg';
  constructor(
    private authService: AuthService,
    private router: Router,
    private loaderService: LoaderService
  ) {
  }
  
  ngAfterViewInit() {
    this.hideLoader = true;
  }
  ngOnInit(): void {
    
    let user = JSON.parse(localStorage.getItem('user'));
    this.name = user ? user.fname + ' ' + user.lname : '';
    this.getAuthenticatedUser();
    if (this.isAuthenticated)
      this.getProductCount();
    this.updatedProductCount();
    this.getCategories();
    this.searchSubject
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(d => {
        //console.log(d);
        this.onSearchProduct(d);
      });
  }

  getCategories() {
    let reqBody = {
      skip: 0,
      limit: 100
    };
    this.loaderService.showLoading();
    this.authService.getCategories(reqBody).subscribe(
      data => {
        this.loaderService.closeLoading();
        this.categories = data['data'];
      },
      error => {
        console.log(error);
      }
    );
  }

  getSearchValue($event: any) {
    const value = $event.target.value;
    if (value) {
      this.searchTerm = value;
      this.searchSubject.next(value);
    } else {
      this.searchResult = [];
    }
  }

  logout() {
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('password');
    this.router.navigateByUrl('/');
  }

  onSearchProduct(searchValue) {
    if (searchValue === '') {
      this.searchResult = [];
      this.loaderService.closeLoading();
    }
    this.loaderService.showLoading();
    this.authService.searchProduct(searchValue).subscribe(resp => {
      this.loaderService.closeLoading();
      this.searchResult = resp['data'];
      this.showSearchResultSection = true;
    });
  }

  goToResults() {
    if (this.searchTerm)
      this.router.navigate([`/search-results/${this.searchTerm}`])
  }
  getProductCount() {
    let obj = {
      skip: 0,
      limit: 10
    };
    this.loaderService.showLoading();
    this.authService.getCartList(obj).subscribe((resp: any) => {
      this.loaderService.closeLoading();
      if (resp.data.length) {
        this.dataResponse = resp.data[0].products;
        this.dataResponse.map(item => {
          this.totalAmout =
            parseInt(this.totalAmout) +
            parseInt(item.orderPrice) * parseInt(item.quantity);
        });
        this.productCount = localStorage.getItem('user')
          ? resp.data[0].products.length
          : '';
      }
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

  ngOnDestroy() {
    this.searchSubject.unsubscribe();
  }

  // toggleDropdown() {
  //   this.showDropdown = !this.showDropdown;
  // }

  redirectToProdDescription(id) {
    this.router.navigate(['product-description/', id]);
  }
}
