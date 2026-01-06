import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { TokenPayload } from '../../shared/models/token-payload.model';

/**
 * Servicio: AuthTokenService
 *
 * Descripción:
 *  Maneja el ciclo de vida del token JWT en el cliente:
 *    - Guardar token
 *    - Recuperarlo
 *    - Eliminarlo
 *    - Decodificarlo
 *
 * Características:
 *  - Seguro para SSR (Angular Universal)
 *  - Soporta sesión persistente (localStorage) y temporal (sessionStorage)
 *  - No realiza llamadas HTTP
 *  - No depende de otros servicios
 */
@Injectable({ providedIn: 'root' })
export class AuthTokenService {

  /** Identificador de plataforma para validar si estamos en navegador */
  private readonly platformId = inject(PLATFORM_ID);

  /** Clave usada para almacenar el token */
  private readonly TOKEN_KEY = 'authToken';

  // ============================================================
  // TOKEN: SET / GET / CLEAR
  // ============================================================

  /**
   * Guarda el token JWT en el almacenamiento adecuado.
   * @param token - Token JWT recibido del backend
   * @param remember - true → localStorage (persistente), false → sessionStorage (temporal)
   */
  setToken(token: string, remember: boolean): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Obtiene el token almacenado.
   * Prioriza localStorage, luego sessionStorage.
   * @returns Token JWT o null si no existe
   */
  getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;

    return (
      localStorage.getItem(this.TOKEN_KEY) ||
      sessionStorage.getItem(this.TOKEN_KEY)
    );
  }

  /**
   * Elimina el token de ambos almacenamientos.
   */
  clearToken(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    localStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.TOKEN_KEY);
  }

  // ============================================================
  // TOKEN: DECODIFICACIÓN
  // ============================================================

  /**
   * Decodifica el token JWT y devuelve su payload tipado.
   * @returns TokenPayload o null si el token es inválido o no existe
   */
  decodeToken(): TokenPayload | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode<TokenPayload>(token);
    } catch {
      return null;
    }
  }

  /**
   * Obtiene el nombre de usuario desde el token decodificado.
   * @returns Username o null si no está presente
   */
  getUsernameFromToken(): string | null {
    return this.decodeToken()?.user ?? null;
  }
}
