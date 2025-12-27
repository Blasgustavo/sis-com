import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  private plataformId = inject(PLATFORM_ID)

  // Definimos el constructor para inyectar AuthService y Router
  constructor(private authService: AuthService, private router: Router) {}
  // Implementamos el método canActivate
  canActivate(): boolean {
    // SSR: no hay localStorage -> no redirigir
    if(!isPlatformBrowser(this.plataformId)){return true;}
    // Lógica para verificar si el usuario está autenticado
    if(this.authService.isLoggedIn()) {
      return true; // Permitir acceso si está autenticado
    }
    this.router.navigate(['/login']),{
      replaceUrl: true,
      skipLocationChange: true
    }

    return false;
  }
}
