import { HttpClient } from '@angular/common/http';
import { AuthService } from './../services/auth/auth.service';
import { ToastService } from './../services/shared/toast.service';
import { Component, OnInit } from '@angular/core';

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
'state':'',

};
userData: any;
  constructor(private notification:ToastService,private authService: AuthService,private httpClient:HttpClient) { }

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
    return new Promise((resolve)=>{
      this.authService.getUserDetails().subscribe(data => {
        //console.log(data);
        //this.router.navigateByUrl("/address-information");
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
      const res:any=await this.httpClient.put('users/save-address',{'address':this.address}).toPromise();
      console.log(res);
      if(res.ok){
        this.notification.openSnackbar("Adress Saved Successfully");
      }
    }
}
