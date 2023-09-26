import { Injectable } from '@angular/core';
import { Router, CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DataService } from './data.service';
import { LoginService } from './core';

@Injectable( { providedIn: 'root' } )

export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private router: Router, private loginService: LoginService, private dataService: DataService) {
    console.log("AuthGuard created");
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {

    if (!this.dataService.production || this.loginService.isAuthenticated())
    {
      return true;
    }

    this.router.navigateByUrl("/home");
    return false;
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.canActivate(next, state)
  }
}