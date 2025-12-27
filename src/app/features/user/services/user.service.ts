import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';

export interface UserData {
  id: string;
  user: string;
  password: string;
  role: string;
  datecreate: string;
  image: string;
  names: string;
  iat?: number;
  exp?: number;
}

// Tipo extendido para actualizaciones que incluyen validación
export type UpdatePayload = Partial<UserData> & { currentPassword?: string };

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private platformId = inject(PLATFORM_ID);

  private userSubject = new BehaviorSubject<UserData | null>(null);
  user$ = this.userSubject.asObservable();

  private readonly API_URL = 'http://localhost:3000/api/users/';

  constructor(private http: HttpClient) {
    this.loadUserFromToken();
  }

  // Cargar usuario desde el token al iniciar la app
  private loadUserFromToken() {
    if (!isPlatformBrowser(this.platformId)) return;

    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const decoded = jwtDecode<UserData>(token);
      this.userSubject.next(decoded);
    } catch (error) {
      console.error('Error al decodificar el token', error);
      this.userSubject.next(null);
    }
  }

  // Obtener usuario actual (sincrónico)
  getUser(): UserData | null {
    return this.userSubject.value;
  }

  // Cargar datos reales desde la BD
  getUserFromBackend(username: string): Observable<UserData> {
    return this.http.get<UserData>(`${this.API_URL}${username}`);
  }

  // Sincronizar estado local con la BD
  loadUserFromBackend() {
    const username = this.getUser()?.user;
    if (!username) return;

    this.getUserFromBackend(username).subscribe({
      next: user => this.userSubject.next(user),
      error: err => console.error('Error cargando usuario desde backend', err)
    });
  }

  // Actualizar usuario localmente (solo frontend)
  updateUser(data: Partial<UserData>) {
    const { password, ...safeData } = data;
    const current = this.userSubject.value;
    if (!current) return;

    const updated = { ...current, ...safeData };
    this.userSubject.next(updated);
  }

  // Actualizar usuario en el servidor por username (con validación opcional)
  updateUserByUsername(username: string, data: UpdatePayload): Observable<UserData> {
    return this.http.put<UserData>(`${this.API_URL}${username}`, data, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Actualizar usuario y sincronizar estado local
  syncUserUpdate(username: string, data: UpdatePayload) {
    return this.updateUserByUsername(username, data).subscribe({
      next: updatedUser => {
        this.updateUser(updatedUser);
      },
      error: err => {
        console.error('Error al actualizar usuario en el servidor', err);
      }
    });
  }

  // Limpiar usuario al cerrar sesión
  clearUser() {
    this.userSubject.next(null);
  }
}