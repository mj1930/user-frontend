import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  registerForm: FormGroup;
  submitFormAttempt: boolean;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      fname: ['', [Validators.required]],
      lname: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', [Validators.required, Validators.minLength(10)]],
      // gender: [''],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  submitRegisterForm(valid) {
    console.log(this.f);
    this.submitFormAttempt = true;
    if (!valid) {
      return;
    }
    let reqData = {
      fname: this.registerForm.controls['fname'].value,
      lname: this.registerForm.controls['lname'].value,
      email: this.registerForm.controls['email'].value,
      password: this.registerForm.controls['password'].value,
      phone: this.registerForm.controls['phone'].value
      // gender: this.registerForm.controls['gender'].value
    };

    this.authService.register(reqData).subscribe(
      data => {
        console.log(data);
        this.router.navigateByUrl('/login');
      },
      error => {
        console.log(error);
      }
    );
  }

  get f() {
    return this.registerForm.controls;
  }
}
