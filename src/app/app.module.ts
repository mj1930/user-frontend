import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './services/auth/auth.service';
import { LoginComponent } from '../app/auth/login/login.component';
import { SignupComponent } from '../app/auth/signup/signup.component';
import { UserHomepageComponent } from './user-homepage/user-homepage.component';
import { httpInterceptorProviders } from "./http-interceptor";
import { UserCartComponent } from './user-cart/user-cart.component';
import { ProductDescriptionComponent } from './product-description/product-description.component';
import { ProductCategoryViewComponent } from './product-category-view/product-category-view.component';
import { OrderListingComponent } from './order-listing/order-listing.component';
import { OrderInformationComponent } from './order-information/order-information.component';
import { AddressBookComponent } from './address-book/address-book.component';
import { AddressInformationComponent } from './address-information/address-information.component';
import { HeaderComponent } from './header/header.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { LoginSecurityComponent } from './login-security/login-security.component';
import { MyAddressComponent } from './my-address/my-address.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    UserHomepageComponent,
    UserCartComponent,
    ProductDescriptionComponent,
    ProductCategoryViewComponent,
    OrderListingComponent,
    OrderInformationComponent,
    AddressBookComponent,
    AddressInformationComponent,
    HeaderComponent,
    MyAccountComponent,
    LoginSecurityComponent,
    MyAddressComponent
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
