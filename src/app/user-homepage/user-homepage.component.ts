import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { LoaderService } from '../services/shared/loader.service';

@Component({
  selector: 'app-user-homepage',
  templateUrl: './user-homepage.component.html',
  styleUrls: ['./user-homepage.component.css']
})
export class UserHomepageComponent implements OnInit {

  products;
  imgLink = "https://martialartsplusinc.com/wp-content/uploads/2017/04/default-image.jpg";
  catImg = "http://opencart.templatemela.com/OPC10/OPC100240/OPC2/image/catalog/Cat-1.jpg";
  categories = [];
  term : '';
  searchResult = [];
  homeProducts = [];
  showSearchResultSection = false;
  constructor(
      private authService: AuthService,
      private loaderService : LoaderService,
      private router: Router
     ) { }

  ngOnInit(): void {
    this.getProducts();
    this.getCategories();
    this.getHomeProducts();
  }

  getProducts() {
    let obj = {
      skip: 0,
      limit: 10,
      status: true
    }
    this.loaderService.showLoading();
    this.authService.getProducts(obj).subscribe(data => {
      this.loaderService.closeLoading();
      this.products = data['data'];
    }, error => {
      console.log(error);
    })
  }

  getHomeProducts() {
    this.authService.getHomeProducts().subscribe((resp: any) => {
      if (resp.code === 200) {
        this.homeProducts = resp['data'];
      }
    })
  }

  getCategories() {
    let reqBody = {
      skip: 0,
      limit: 100
    };
    this.loaderService.showLoading();
    this.authService.getCategories(reqBody).subscribe(data => {
      this.loaderService.closeLoading();
      this.categories = data['data'];
    }, error => {
      console.log(error);
    })
  }

  searchProduct() {
    this.loaderService.showLoading();
    this.authService.searchProduct(this.term).subscribe(data => {
      this.loaderService.closeLoading();
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
