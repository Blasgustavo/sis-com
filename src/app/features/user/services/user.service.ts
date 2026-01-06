import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthTokenService } from '../../../core/service/auth-token.service';
import { UserData } from '../../../shared/models/user.model';
import { API } from '../../../core/config/api.config';

/**
 * Servicio: UserService
 *
 * Descripción:
 *  Maneja el estado global del usuario autenticado.
 *  Permite:
 *    - Cargar usuario desde backend
 *    - Restaurar usuario desde token
 *    - Actualizar perfil
 *    - Limpiar sesión
 *
 * Arquitectura:
 *  - Usa signals para estado reactivo
 *  - Usa API centralizado para URLs limpias
 */
@Injectable({ providedIn: 'root' })
export class UserService {

  /**
   * Signal privado con el usuario autenticado.
   */
  private _user = signal<UserData | null>(null);

  /**
   * Signal público de solo lectura.
   */
  user = computed(() => this._user());

  constructor(
    private http: HttpClient,
    private tokenService: AuthTokenService
  ) {
    this.restoreUserFromToken();
  }

  // ============================================================
  // Restaurar usuario desde token
  // ============================================================

  private restoreUserFromToken(): void {
    const username = this.tokenService.getUsernameFromToken();
    if (username) this.loadUserFromBackend(username);
  }

  // ============================================================
  // GET usuario desde backend
  // ============================================================

  private getUserFromBackend(username: string): Observable<UserData> {
    return this.http.get<UserData>(API.userByUsername(username));
  }

  /**
   * Carga el usuario desde backend y actualiza el signal global.
   * Este es el método que usa AuthService.
   */
  loadUserFromBackend(username: string): void {
    this.getUserFromBackend(username).subscribe({
      next: user => this._user.set(user),
      error: err => {
        console.error('🚫 Error cargando usuario', err);
        this._user.set(null);
      }
    });
  }

  // ============================================================
  // SET usuario local (sin password)
  // ============================================================

  private setLocalUser(user: UserData): void {
    const { password, ...clean } = user;
    this._user.set(clean);
  }

  // ============================================================
  // UPDATE perfil del usuario autenticado
  // ============================================================

  updateUser(username: string, data: FormData): Observable<UserData> {
    return this.http.put<UserData>(`${API.users}${username}`, data);
  }

  syncUpdateUser(username: string, data: FormData): void {
    this.updateUser(username, data).subscribe({
      next: updated => this.setLocalUser(updated),
      error: err => console.error('🚫 Error actualizando usuario', err)
    });
  }

  // ============================================================
  // LOGOUT
  // ============================================================

  clearUser(): void {
    this._user.set(null);
    this.tokenService.clearToken();
  }
}
