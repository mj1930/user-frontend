import { ToastService } from './../services/shared/toast.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { LoaderService } from '../services/shared/loader.service';

@Component({
  selector: 'app-address-information',
  templateUrl: './address-information.component.html',
  styleUrls: ['./address-information.component.css']
})
export class AddressInformationComponent implements OnInit {
  userData: any;
  cities: any = [];
  address={
    'name':'',
    'company':'',
    'address1':'',
    'address2':'',
    'city':'',
    'postal_code':'',
    'country':'India',
    'state':'',
    'default':'true'
  }

  constructor(
     private authService: AuthService,
     private router: Router ,
     private httpClient:HttpClient,
     private loaderService:LoaderService,
     private notification:ToastService
     ) { }

  async ngOnInit() {
    this.userData = await this.getUserDetails();
    this.address.name = this.userData.fname + " " +this.userData.lname;
    //set all data from user address
    this.address.address1 = this.userData.address.address1?this.userData.address.address1:'';
    this.address.address2 = this.userData.address.address2?this.userData.address.address2:'';
    this.address.city = this.userData.address.city?this.userData.address.city:'';
    this.address.state = this.userData.address.state?this.userData.address.state:'';
    this.address.postal_code = this.userData.address.postal_code?this.userData.address.postal_code:'';

  }

  getProducts() {
    let productIds = localStorage.getItem('productIds');
    this.authService.getProductsCity(productIds).subscribe((resp: any)=> {
      this.cities = resp['data'];
    })
  }

  async getUserDetails() {
    return new Promise((resolve) => {
      this.loaderService.showLoading();
      this.authService.getUserDetails().subscribe(data => {
        this.loaderService.closeLoading();
        resolve(data['data']);
      }, error => {
        console.log(error);
      })
    })
  }

  goToAddAddress() {

    this.router.navigateByUrl('/address-book');
  }

  async payNow() {
    if( !this.validateAddress())
      return;
    localStorage.setItem('address', JSON.stringify(this.address));
    this.router.navigate(['/transaction']);
  }

  validateAddress() {
  for(let key in this.address){
    if(key=='company')
      continue;
    if(this.address[key]=='') {
      this.notification.openSnackbar(key + " can not be empty");
      return false;
    }
  }
   return true;
  }


  post(obj, url) {
    var mapForm = document.createElement("form");
    //mapForm.target = "_blank";
    mapForm.method = "GET"; // or "post" if appropriate
    mapForm.action = url;
    Object.keys(obj).forEach(function (param) {
      var mapInput = document.createElement("input");
      mapInput.type = "hidden";
      mapInput.name = param;
      mapInput.setAttribute("value", obj[param]);
      mapForm.appendChild(mapInput);
    });
    document.body.appendChild(mapForm);
    mapForm.submit();
  }
}
