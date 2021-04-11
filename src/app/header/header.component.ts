import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

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
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.getCategories();
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

  searchProduct() {
    this.authService.searchProduct(this.term).subscribe(data => {
      console.log(data);
      this.searchResult=data['data'];
      this.showSearchResultSection =true;
    }, error => {
      console.log(error);
    })
  }

  setProductSearchText(id) {
    this.router.navigate(['product-description', id])
  }

}
