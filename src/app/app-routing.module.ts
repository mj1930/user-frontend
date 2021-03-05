import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../app/auth/login/login.component';
import { SignupComponent } from '../app/auth/signup/signup.component';
import { UserHomepageComponent } from './user-homepage/user-homepage.component';


const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: '/'},
  {path: 'home', component: UserHomepageComponent},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
