import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-user-homepage',
  templateUrl: './user-homepage.component.html',
  styleUrls: ['./user-homepage.component.css']
})
export class UserHomepageComponent implements OnInit {

  products;
  imgLink = "http://www.thejungleadventure.com/assets/images/noimage/noimage.png";
  catImg = "http://opencart.templatemela.com/OPC10/OPC100240/OPC2/image/catalog/Cat-1.jpg";
  categories = [];
  term : '';
  searchResult = [];
  showSearchResultSection = false;
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.getProducts();
    this.getCategories();
  }

  getProducts() {
    let obj = {
      skip: 0,
      limit: 10,
      status: true
    }
    this.authService.getProducts(obj).subscribe(data => {
      this.products = data['data'];
    }, error => {
      console.log(error);
    })
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
