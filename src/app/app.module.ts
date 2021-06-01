import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './services/auth/auth.service';
import { LoginComponent } from '../app/auth/login/login.component';
import { SignupComponent } from '../app/auth/signup/signup.component';
import { UserHomepageComponent } from './user-homepage/user-homepage.component';
import { httpInterceptorProviders } from './http-interceptor';
import { UserCartComponent } from './user-cart/user-cart.component';
import { ProductDescriptionComponent } from './product-description/product-description.component';
import { ProductCategoryViewComponent } from './product-category-view/product-category-view.component';
import { OrderListingComponent } from './order-listing/order-listing.component';
import { OrderInformationComponent } from './order-information/order-information.component';
import { AddressBookComponent } from './address-book/address-book.component';
import { AddressInformationComponent } from './address-information/address-information.component';
import { HeaderComponent } from './header/header.component';
import { AuthGuard } from './services/auth/authGuard';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MyAccountComponent } from './my-account/my-account.component';
import { LoginSecurityComponent } from './login-security/login-security.component';
import { MyAddressComponent } from './my-address/my-address.component';
import { FooterComponent } from './footer/footer.component';
import { AddAddressComponent } from './add-address/add-address.component';
import { PaymentResponseComponent } from './payment-response/payment-response.component';
import { PaymentComponent } from './payment/payment.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { PrintInvoiceComponent } from './print-invoice/print-invoice.component';
import { ErrorPageNotFoundComponent } from './error/error-page-not-found/error-page-not-found.component';
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
    MyAddressComponent,
    FooterComponent,
    AddAddressComponent,
    PaymentResponseComponent,
    PaymentComponent,
    ContactUsComponent,
    AboutUsComponent,
    PrivacyPolicyComponent,
    SearchResultsComponent,
    PrintInvoiceComponent,
    ErrorPageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgxSliderModule,
    NgbModule,
    BrowserAnimationsModule,
    MatSnackBarModule
  ],
  providers: [AuthService, httpInterceptorProviders, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule {}
