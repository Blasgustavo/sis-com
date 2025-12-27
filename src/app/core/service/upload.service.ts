import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { form } from '@angular/forms/signals';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private apiUrl = 'https://localhost:3000/api/upload';

  constructor(private http: HttpClient) {}

  uploadImage(archivo: File , folder: string) {
    const formData: FormData = new FormData();
    formData.append('image', archivo);
    formData.append('folder', folder);

    return this.http.post(this.apiUrl, formData);
  }
  
}
