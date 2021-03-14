import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-user-homepage',
  templateUrl: './user-homepage.component.html',
  styleUrls: ['./user-homepage.component.css']
})
export class UserHomepageComponent implements OnInit {

  products;
  imgLink = "http://www.thejungleadventure.com/assets/images/noimage/noimage.png";

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
    let obj = {
      skip: 0,
      limit: 10,
      status: true
    }
    this.authService.getProducts(obj).subscribe(data => {
      console.log(data);
      this.products = data['data'];
    }, error => {
      console.log(error);
    })
  }


}
