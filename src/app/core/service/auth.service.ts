import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
// isPlatformBrowser importa para verificar si la aplicacion se esta ejecutando en el navegador
import { isPlatformBrowser } from '@angular/common';
// platform_id revisa si la aplicacion se esta ejecutando en el navegador o en el servidor
import { PLATFORM_ID } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

import { UserService } from '../../features/user/services/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private platformId = inject(PLATFORM_ID);

  private apiUrl = 'http://localhost:3000/api/auth/login';

  constructor( private http: HttpClient, private userService:UserService) {}

  login(user: string, pasword: string):Observable<any> {
    return this.http.post(`${this.apiUrl}`, {
      user,
      pasword,
    }).pipe(tap((res: any) => {
      if(res.token){
        if(isPlatformBrowser(this.platformId)){
          localStorage.setItem('authToken', res.token);
        }
        //Cargar usuario en el Servicio
        const decoded = jwtDecode(res.token);
        this.userService.updateUser(decoded);

      } else {
        console.error('No se recibió un token de autenticación');
        throw new Error('No se recibió un token de autenticación');
        }
      })
    );
  };

  logout() {
    localStorage.removeItem('authToken');
  };

  isLoggedIn(): boolean {
    if(!isPlatformBrowser(this.platformId)) {
      return false;
    }
    const token = localStorage.getItem('authToken');
    if(!token) return false;
    //return token !== null && token !== 'undefined' && token !== '';

    // Validar la expiracion de l token
    try{
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Date.now()/1000;
  
    } catch{
      return false;
    }
  };
}
