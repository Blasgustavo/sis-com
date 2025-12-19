import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth/login';

  constructor( private http: HttpClient) {}

  login(user: string, pasword: string):Observable<any> {
    return this.http.post(`${this.apiUrl}`, {
      user,
      pasword,
    });
  }

  logout() {
    localStorage.removeItem('authToken');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }
  
}
