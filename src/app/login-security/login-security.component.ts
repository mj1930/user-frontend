import { logging } from 'protractor';
import { HttpClient } from '@angular/common/http';
import { LoaderService } from './../services/shared/loader.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-security',
  templateUrl: './login-security.component.html',
  styleUrls: ['./login-security.component.css']
})
export class LoginSecurityComponent implements OnInit {
  userData: any;
  name:string;

  constructor(private authService:AuthService,private loaderService:LoaderService ,private httpClient:HttpClient) { }

  async ngOnInit() {
   this.userData=await this.getUserDetails();
   this.name=this.userData?.fname + ' ' + this.userData?.lname;
  }
  async getUserDetails() {
    return new Promise((resolve)=>{
     let user= localStorage.getItem('user');
     resolve(JSON.parse(user));
    })
  }

  async update(){
    this.loaderService.showLoading();
    setTimeout(()=>this.loaderService.closeLoading(),1000);
    const payload=
    {
      fname:this.name.substring(0,this.name.indexOf(' ')),
      lname:this.name.substring(this.name.indexOf(' ')),
      email:this.userData.email
    };
    let newUser:any=await this.httpClient.put('users/update-user-details',payload).toPromise();
    console.log(newUser);
    if(newUser._id){
      this.userData.fname=newUser.fname;
      this.userData.lname=newUser.lname;
      localStorage.setItem('user',JSON.stringify(this.userData));
      //update if behaviour subject any
    }
  }
}
