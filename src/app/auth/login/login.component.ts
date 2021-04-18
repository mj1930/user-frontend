import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import {
  Router,
  ActivatedRoute,
  ActivatedRouteSnapshot
} from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import {
  LocationStrategy,
  PathLocationStrategy,
  Location
} from '@angular/common';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [
    Location,
    { provide: LocationStrategy, useClass: PathLocationStrategy }
  ]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loginAttempt: boolean;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private location: Location,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  login(valid) {
    this.loginAttempt = true;
    if (!valid) {
      return;
    }

    // let param = sessionStorage.getItem('currentUrl');
    // if (param) {
    //   console.log('Hi', param);
    //   // this.router.navigate([]);
    //   const productId = this.authService.productId.subscribe(id => {
    //     return id;
    //   });
    //   this.router.navigate(['/product-description', productId]);
    // }

    let reqData = {
      email: this.loginForm.controls['email'].value,
      password: this.loginForm.controls['password'].value
    };

    this.authService.login(reqData).subscribe(
      data => {
        console.log(data);
        sessionStorage.setItem('token', data['accessToken']);
        localStorage.setItem('user', JSON.stringify(data['data']));
        if (this.loginForm.controls['rememberMe'].value) {
          localStorage.setItem('remember', JSON.stringify(true));
          localStorage.setItem('email', this.loginForm.controls['email'].value);
          localStorage.setItem(
            'password',
            this.loginForm.controls['password'].value
          );
        } else {
          localStorage.setItem('remember', JSON.stringify(false));
          localStorage.setItem('email', '');
          localStorage.setItem('password', '');
        }
        this.router.navigateByUrl('/user-home-page');
      },
      error => {
        console.log(error);
      }
    );
  }
}
