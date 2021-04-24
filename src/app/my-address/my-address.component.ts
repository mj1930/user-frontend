import { Component, OnInit } from '@angular/core';
import { userInfo } from 'node:os';

@Component({
  selector: 'app-my-address',
  templateUrl: './my-address.component.html',
  styleUrls: ['./my-address.component.css']
})
export class MyAddressComponent implements OnInit {

  public address: any;
  public name: any;
  constructor() { }

  ngOnInit(): void {
    let user: any = JSON.parse(localStorage.getItem('user'));
    this.name = user.fname + " " + user.lname;
    this.address = user.address;
  }

}
