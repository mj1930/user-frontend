import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { LoaderService } from '../services/shared/loader.service';

@Component({
  selector: 'app-address-book',
  templateUrl: './address-book.component.html',
  styleUrls: ['./address-book.component.css']
})
export class AddressBookComponent implements OnInit {
  userData: any;

  constructor(private authService: AuthService, private loaderService:LoaderService) { }

  ngOnInit(): void {
    this.getUserDetails();
  }

  getUserDetails() {
    this.loaderService.showLoading();
    this.authService.getUserDetails().subscribe(data => {
      this.loaderService.closeLoading();
      //console.log(data);
      //this.router.navigateByUrl("/address-information");
      this.userData = data['data'];
    }, error => {
      console.log(error);
    })
  }

}
