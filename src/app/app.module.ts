import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './services/auth/auth.service';
import { HomepageComponent } from './homepage/homepage.component';
import { LoginComponent } from '../app/auth/login/login.component';
import { SignupComponent } from '../app/auth/signup/signup.component';
import { UserHomepageComponent } from './user-homepage/user-homepage.component';
import { httpInterceptorProviders } from "./http-interceptor";

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    LoginComponent,
    SignupComponent,
    UserHomepageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [AuthService, httpInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
