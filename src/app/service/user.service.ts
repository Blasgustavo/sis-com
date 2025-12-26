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

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private platformId = inject(PLATFORM_ID);

  private userSubject = new BehaviorSubject<UserData | null>(null);
  user$ = this.userSubject.asObservable();

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

  // Actualizar usuario localmente (solo frontend)
  updateUser(data: Partial<UserData>) {
    const current = this.userSubject.value;
    if (!current) return;

    const updated = { ...current, ...data };
    this.userSubject.next(updated);
  }

  updateUserByUsername(username: string, data: Partial<UserData>): Observable<UserData> {
    return this.http.patch<UserData>(`http://localhost:3000/api/users/${username}`, 
      data, { headers: { 'Content-Type': 'application/json' }
    });
  }


  // Actualizar usuario en el servidor y sincronizar estado local
  syncUserUpdate(data: Partial<UserData>) {
    return this.http.patch<UserData>('/api/users/update', data).subscribe({
      next: (updatedUser) => {
        this.updateUser(updatedUser); // sincroniza frontend
      },
      error: (err) => {
        console.error('Error al actualizar usuario en el servidor', err);
      },
    });
  }

  // Limpiar usuario al cerrar sesión
  clearUser() {
    this.userSubject.next(null);
  }
}
