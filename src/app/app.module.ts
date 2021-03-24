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
import { UserCartComponent } from './user-cart/user-cart.component';
import { ProductDescriptionComponent } from './product-description/product-description.component';
import { ProductCategoryViewComponent } from './product-category-view/product-category-view.component';
import { OrderListingComponent } from './order-listing/order-listing.component';
import { OrderInformationComponent } from './order-information/order-information.component';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    LoginComponent,
    SignupComponent,
    UserHomepageComponent,
    UserCartComponent,
    ProductDescriptionComponent,
    ProductCategoryViewComponent,
    OrderListingComponent,
    OrderInformationComponent
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
