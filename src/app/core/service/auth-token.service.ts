import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { jwtDecode } from 'jwt-decode';

export interface TokenPayload {
  id: string;
  user: string;
  role: string;
  iat?: number;
  exp?: number;
}

@Injectable({ providedIn: 'root' })
export class AuthTokenService {
  private platformId = inject(PLATFORM_ID);
  private readonly TOKEN_KEY = 'authToken';

  // Guardar token
  setToken(token: string) {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // Obtener token
  getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Eliminar token
  clearToken() {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.removeItem(this.TOKEN_KEY);
  }

  // Decodificar token
  decodeToken(): TokenPayload | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode<TokenPayload>(token);
    } catch {
      return null;
    }
  }

  // Obtener username desde token
  getUsernameFromToken(): string | null {
    return this.decodeToken()?.user ?? null;
  }
}