import { HttpClient } from '@angular/common/http';
import { AuthService } from './../services/auth/auth.service';
import { ToastService } from './../services/shared/toast.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoaderService } from '../services/shared/loader.service';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.css']
})
export class AddAddressComponent implements OnInit {
address={
  'country':'India',
  'name':'',
  'mobile':'',
  'address1':'',
  'address2':'',
  'postal_code':'',
  'landmark':'',
  'city':'',
  'state':''
};
userData: any;
  constructor(
    private notification:ToastService,
    private authService: AuthService,
    private httpClient:HttpClient,
    private loaderService:LoaderService,
    private router: Router
    ) { }

  async ngOnInit() {
    this.userData=await this.getUserDetails();
    this.address.name=this.userData.fname + " " +this.userData.lname;
    this.address.mobile=this.userData.address.mobile?this.userData.address.mobile:'';
    this.address.address1=this.userData.address.address1?this.userData.address.address1:'';
    this.address.address2=this.userData.address.address2?this.userData.address.address2:'';
    this.address.landmark=this.userData.address.landmark?this.userData.address.landmark:'';
    this.address.city=this.userData.address.city?this.userData.address.city:'';
    this.address.state=this.userData.address.state?this.userData.address.state:'';
    this.address.postal_code=this.userData.address.postal_code?this.userData.address.postal_code:'';

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

  validateAddress() {
    for(let key in this.address){
      if(key=='company' || key=='default')
        continue;
      if(this.address[key]==''){
        //alert(key + " can not be empty");
        this.notification.openSnackbar(key + " can not be empty");
        return false;
      }
    }
     return true;
    }
    async updateAddress(){
      if(!this.validateAddress())
        return;
      const res: any = await this.httpClient.put('users/save-address', {'address':this.address}).toPromise();
      if(res.ok) {
        localStorage.setItem('user', JSON.stringify(res.data))
        this.notification.openSnackbar("Address Saved Successfully");
        this.router.navigate(['/my-addresses']);
      }
    }
}
