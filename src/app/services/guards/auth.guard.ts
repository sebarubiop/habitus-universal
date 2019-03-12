import { Injectable } from '@angular/core'
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'

import { AuthenticationService } from '@app/services/authentication.service'

@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate {

  redirectUrl

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) { }

  canActivate(router: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.loggedIn()) {
      return true
    } else {
      this.redirectUrl = state.url; // Grab previous urul
      this.router.navigate(['/login'])
      return false
    }
  }
}
