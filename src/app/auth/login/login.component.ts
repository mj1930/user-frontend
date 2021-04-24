import { LoaderService } from './../../services/shared/loader.service';
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
import { ToastService } from 'src/app/services/shared/toast.service';
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
    private loaderService:LoaderService,
    private notification: ToastService,

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

    let reqData = {
      email: this.loginForm.controls['email'].value,
      password: this.loginForm.controls['password'].value
    };
    this.loaderService.showLoading();
    this.authService.login(reqData).subscribe(
      (data: any) => {
        this.loaderService.closeLoading();
        if (data.code == 200) {
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
          this.notification.openSnackbar(data.message);
          this.router.navigateByUrl('/user-home-page');
        } else {
          this.notification.openSnackbar(data.message);
        }
      },
      error => {
        console.log(error);
      }
    );
  }
}
