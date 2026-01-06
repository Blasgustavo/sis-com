import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserData } from '../../../shared/models/user.model';
import { API } from '../../../core/config/api.config';

@Injectable({ providedIn: 'root' })
export class UserListService {

  private http = inject(HttpClient);
  private readonly API_URL = API.users;

  // ============================================================
  // Obtener todos los usuarios
  // ============================================================
  getAllUsers(): Observable<UserData[]> {
    return this.http.get<UserData[]>(this.API_URL);
  }

  // ============================================================
  // Crear nuevo usuario (admin)
  // ============================================================
  createUser(data: FormData | Partial<UserData>): Observable<UserData> {
    return this.http.post<UserData>(this.API_URL, data);
  }

  // ============================================================
  // Actualizar usuario por ID o username
  // ============================================================
  updateUser(identifier: string, data: FormData): Observable<UserData> {
    return this.http.put<UserData>(`${this.API_URL}${identifier}`, data);
  }

  // ============================================================
  // Eliminar usuario
  // ============================================================
  deleteUser(identifier: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}${identifier}`);
  }

  // ============================================================
  // Obtener usuario individual
  // ============================================================
  getUser(identifier: string): Observable<UserData> {
    return this.http.get<UserData>(`${this.API_URL}${identifier}`);
  }
}