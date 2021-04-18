import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-address-book',
  templateUrl: './address-book.component.html',
  styleUrls: ['./address-book.component.css']
})
export class AddressBookComponent implements OnInit {
  userData: any;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.getUserDetails();
  }

  getUserDetails() {
    this.authService.getUserDetails().subscribe(data => {
      //console.log(data);
      //this.router.navigateByUrl("/address-information");
      this.userData = data['data'];
    }, error => {
      console.log(error);
    })
  }

}
