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

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.getCategories();
    this.searchSubject
      .pipe(
        debounceTime(2000),
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

  onSearchProduct(searchValue) {
    this.filteredList$ = this.authService
      .searchProduct(searchValue)
      .subscribe(resp => {
        this.searchResult = resp['data'];
        this.showSearchResultSection = true;
        console.log('DATA--------', this.searchResult);
      });
    console.log('FILTEREDLIST', this.filteredList$);
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
}
