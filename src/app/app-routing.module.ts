import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
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
