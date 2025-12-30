import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserData } from './user.service';

@Injectable({ providedIn: 'root' })
export class UserListService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:3000/api/users';

  getAllUsers(): Observable<UserData[]> {
    return this.http.get<UserData[]>(this.API_URL);
  }
}
