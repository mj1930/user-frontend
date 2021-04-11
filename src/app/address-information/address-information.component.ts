import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-address-information',
  templateUrl: './address-information.component.html',
  styleUrls: ['./address-information.component.css']
})
export class AddressInformationComponent implements OnInit {
  userData: any;

  constructor(private authService: AuthService, private router: Router) { }

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

  goToAddAddress() {
    this.router.navigateByUrl('/address-book');
  }


}
