import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-user-homepage',
  templateUrl: './user-homepage.component.html',
  styleUrls: ['./user-homepage.component.css']
})
export class UserHomepageComponent implements OnInit {

  products;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
    this.authService.getProducts().subscribe(data => {
      console.log(data);
      this.products = data['data'];
    }, error => {
      console.log(error);
    })
  }


}
