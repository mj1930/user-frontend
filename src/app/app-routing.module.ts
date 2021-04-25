import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../app/auth/login/login.component';
import { SignupComponent } from '../app/auth/signup/signup.component';
import { AddressBookComponent } from './address-book/address-book.component';
import { AddressInformationComponent } from './address-information/address-information.component';
import { LoginSecurityComponent } from './login-security/login-security.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { MyAddressComponent } from './my-address/my-address.component';
import { OrderInformationComponent } from './order-information/order-information.component';
import { OrderListingComponent } from './order-listing/order-listing.component';
import { ProductCategoryViewComponent } from './product-category-view/product-category-view.component';
import { ProductDescriptionComponent } from './product-description/product-description.component';
import { UserCartComponent } from './user-cart/user-cart.component';
import { UserHomepageComponent } from './user-homepage/user-homepage.component';
import { AuthGuard } from '../app/services/auth/authGuard';
import { AddAddressComponent } from './add-address/add-address.component';
import { PaymentResponseComponent } from './payment-response/payment-response.component';
import { PaymentComponent } from './payment/payment.component';

const routes: Routes = [
  { path: '', component: UserHomepageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'cart', component: UserCartComponent, canActivate: [AuthGuard] },
  { path: 'product-description/:id', component: ProductDescriptionComponent },
  { path: 'order-listing', component: OrderListingComponent },
  { path: 'product-category/:id', component: ProductCategoryViewComponent },
  { path: 'address-book', component: AddressBookComponent },
  { path: 'address-information', component: AddressInformationComponent },
  {path: 'my-account', component: MyAccountComponent,  canActivate: [AuthGuard]},
  {path: 'login-security', component: LoginSecurityComponent,  canActivate: [AuthGuard]},
  {path: 'my-addresses', component: MyAddressComponent, canActivate: [AuthGuard]},
  {path: 'add-address', component: AddAddressComponent},
  {path: 'response', component: PaymentResponseComponent, canActivate: [AuthGuard]},
  {path:'order-status/:orderId',component:PaymentResponseComponent, canActivate: [AuthGuard]},
  {path:'order-detail/:orderId',component:OrderInformationComponent, canActivate: [AuthGuard]},
  {path:'transaction',component: PaymentComponent, canActivate: [AuthGuard]},
  { path: '**', component: UserHomepageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
