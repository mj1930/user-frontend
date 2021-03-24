import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../app/auth/login/login.component';
import { SignupComponent } from '../app/auth/signup/signup.component';
import { AddressBookComponent } from './address-book/address-book.component';
import { AddressInformationComponent } from './address-information/address-information.component';
import { OrderInformationComponent } from './order-information/order-information.component';
import { OrderListingComponent } from './order-listing/order-listing.component';
import { ProductCategoryViewComponent } from './product-category-view/product-category-view.component';
import { ProductDescriptionComponent } from './product-description/product-description.component';
import { UserCartComponent } from './user-cart/user-cart.component';
import { UserHomepageComponent } from './user-homepage/user-homepage.component';


const routes: Routes = [
  {path: '', pathMatch:"full", redirectTo:"/user-home-page"},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'cart', component: UserCartComponent},
  {path: 'product-description/:id', component: ProductDescriptionComponent},
  {path: 'order-listing', component: OrderListingComponent},
  {path: 'product-category/:id', component: ProductCategoryViewComponent},
  {path: 'user-home-page', component: UserHomepageComponent},
  {path: 'address-book', component: AddressBookComponent},
  {path: 'address-information', component: AddressInformationComponent},
  {path:'**', component: LoginComponent}


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
