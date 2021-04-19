import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterState,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    let isAuthenticated: boolean = localStorage.getItem('user') ? true : false;

    if (!isAuthenticated) {
      alert('You are not allowed to view this page, Please login!!');
      this.router.navigate(['login']);
      console.log('this.router', this.router.url);
      sessionStorage.setItem('currentUrl', this.router.url);
      return false;
    }
    return true;
  }
}
