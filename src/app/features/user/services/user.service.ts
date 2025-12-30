import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthTokenService } from '../../../core/service/auth-token.service';

export interface UserData {
  id: string;
  user: string;
  password?: string; // opcional porque el backend NO debe devolverla
  role: string;
  datecreate: string;
  image: string;
  names: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private userSubject = new BehaviorSubject<UserData | null>(null);
  user$ = this.userSubject.asObservable();

  private readonly API_URL = 'http://localhost:3000/api/users/';

  constructor(
    private http: HttpClient,
    private tokenService: AuthTokenService
  ) {
    this.restoreUserFromBackend();
  }

  // ============================================================
  // Cargar usuario real desde backend usando el username del token
  // ============================================================

  private restoreUserFromBackend() {
    const username = this.tokenService.getUsernameFromToken();
    if (!username) return;

    this.loadUserFromBackend(username);
  }

  // ============================================================
  // Obtener usuario desde backend
  // ============================================================

  getUserFromBackend(username: string): Observable<UserData> {
    return this.http.get<UserData>(`${this.API_URL}${username}`);
  }

  // ============================================================
  // Cargar usuario y actualizar estado local
  // ============================================================

  loadUserFromBackend(username: string) {
    this.getUserFromBackend(username).subscribe({
      next: user => this.userSubject.next(user),
      error: err => console.error('Error cargando usuario', err)
    });
  }

  // ============================================================
  // Obtener usuario actual
  // ============================================================

  getUser(): UserData | null {
    return this.userSubject.value;
  }

  // ============================================================
  // Actualizar usuario localmente (sin password)
  // ============================================================

  updateLocalUser(user: UserData) {
    const { password, ...clean } = user;
    this.userSubject.next({ ...clean });
  }

  // ============================================================
  // Actualizar usuario en backend
  // ============================================================

  updateUserByUsername(username: string, data: FormData): Observable<UserData> {
    return this.http.put<UserData>(`${this.API_URL}${username}`, data);
  }

  // ============================================================
  // Actualizar backend + estado local
  // ============================================================

  syncUserUpdate(username: string, data: FormData) {
    return this.updateUserByUsername(username, data).subscribe({
      next: updated => this.updateLocalUser(updated),
      error: err => console.error('Error actualizando usuario', err)
    });
  }

  // ============================================================
  // Logout
  // ============================================================

  clearUser() {
    this.userSubject.next(null);
    this.tokenService.clearToken();
  }
}