import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../app/auth/login/login.component';
import { SignupComponent } from '../app/auth/signup/signup.component';


const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: '/'},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
