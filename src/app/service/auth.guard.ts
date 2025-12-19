import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  // Definimos el constructor para inyectar AuthService y Router
  constructor(private authService: AuthService, private router: Router) {}
  // Implementamos el método canActivate
  canActivate(): boolean {
    // Lógica para verificar si el usuario está autenticado
    if(this.authService.isLoggedIn()) {
      return true; // Permitir acceso si está autenticado
    } else {
      this.router.navigate(['/login']); // Redirigir al login si no está autenticado
      return false; // Bloquear acceso
    }
  }
}
