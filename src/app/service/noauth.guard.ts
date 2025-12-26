import { AuthService } from './auth.service';
import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NoauthGuard implements CanActivate {
  
  private platformId = inject(PLATFORM_ID);

  constructor (private AuthService: AuthService, private router: Router){}

  canActivate(): boolean {
    if(!isPlatformBrowser(this.platformId)) return true; 
    
    if(this.AuthService.isLoggedIn()) {
      this.router.navigate(['/home'],{
        replaceUrl: true,
        //skipLocationChange: true
      });
      return false;
    }
    return true;
  };
}
