import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';

export interface UserData{
  id: string;
  user: string;
  role: string;
  image: string;
  names: string;
  iat?: number;
  exp?: number;
}

@Injectable({
  providedIn: 'root',
})

export class UserService {
  private plataformId = inject(PLATFORM_ID);

  // Estado del usuario, BehaviorSubjet hace que 
  private userSubjet = new BehaviorSubject<UserData | null>(null);
  user$ = this.userSubjet.asObservable();

  constructor(){
    this.loadUserFromToken();
  }

  // Cargar el usuario desde el tooken al iniciar la app
  private loadUserFromToken(){
    if(!isPlatformBrowser(this.plataformId)) return;
  
    const token = localStorage.getItem('authToken');
    if(!token) return;
    
    try{
      const decoded = jwtDecode <UserData>(token);
      this.userSubjet.next(decoded);
    } catch (error){
      console.error('Error al decodificar el token', error)
      this.userSubjet.next(null);
    }
  }

  // Obtener ussuario actual (sincrono)
  getUser(): UserData | null {
    return this.userSubjet.value;
  }

  //Actualizar usuario manualmente
  updateUser(data: Partial<UserData>){
    const current = this.userSubjet.value;
    if(!current) return;
  
    const update = { ...current, ...data}
    this.userSubjet.next(update);

  }
  //limpiar usuario al cerrar secion
  clearUser(){
    this.userSubjet.next(null);
  }
  
}
