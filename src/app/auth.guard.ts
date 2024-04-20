import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AngularFireAuth, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.auth.user.pipe(
      take(1),
      map(user => {
        if (user) {
          // If the user is logged in, check the route they are trying to access
          if (state.url === '/sign') {
            // If they are trying to access the '/sign' route, redirect them to the main page
            this.router.navigate(['/']);
            return false;
          } else if (state.url === '/cart' ||state.url === '/account' || state.url === '/orders') {
            // If they are trying to access the '/cart' or '/account' or '/orders' route, allow access
            return true;
          } else {
            // Otherwise, allow them to access the route
            return true;
          }
        } else {
          // If the user is not logged in, check the route they are trying to access
          if (state.url === '/cart' || state.url === '/account' || state.url === '/orders') {
            // If they are trying to access the '/cart' or '/account' or '/orders' route, redirect them to the sign-in page
            this.router.navigate(['/sign']);
            return false;
          } else {
            // Otherwise, allow them to access the route
            return true;
          }
        }
      })
    );
  }
}