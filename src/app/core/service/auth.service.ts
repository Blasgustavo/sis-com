import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

import { AuthTokenService } from './auth-token.service';
import { UserService } from '../../features/user/services/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  private apiUrl = 'http://localhost:3000/api/auth/login';

  constructor(
    private http: HttpClient,
    private tokenService: AuthTokenService,
    private userService: UserService
  ) {}

  // ============================================================
  // LOGIN
  // ============================================================

  login(user: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}`, { user, password }).pipe(
      tap((res: any) => {
        if (!res.token) {
          console.error('No se recibió un token de autenticación');
          throw new Error('No se recibió un token de autenticación');
        }

        // 1. Guardar token
        this.tokenService.setToken(res.token);

        // 2. Obtener username desde el token
        const username = this.tokenService.getUsernameFromToken();

        // 3. Cargar usuario real desde backend
        if (username) {
          this.userService.loadUserFromBackend(username);
        }
      })
    );
  }

  // ============================================================
  // LOGOUT
  // ============================================================

  logout() {
    this.tokenService.clearToken();
    this.userService.clearUser();
  }

  // ============================================================
  // ESTADO DE AUTENTICACIÓN
  // ============================================================

  isLoggedIn(): boolean {
    return this.tokenService.getToken() !== null;
  }
}