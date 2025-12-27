import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/service/auth.service';
import { NavService } from '../../../core/service/nav.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: '../pages/login.html',
  styleUrl: '../pages/login.css',
})
export class Login {
  //Definicion de variables para el usuario y la contraseña
  user: string = '';
  password: string = '';
  //Inyeccion del router en el constructor
  constructor(private authService: AuthService, private nav:NavService) {}
  //Metodo para manejar el evento de login
  onLogin() {
    console.log("Intentando iniciar sesion con usuario:", this.user);
    this.authService.login(this.user, this.password).subscribe({
      next: (response) => {
        console.log('Login exitoso:', response);
        localStorage.setItem('authToken', response.token);
        //Navegacion a la pagina Home despues del login
        this.nav.goReplace('/home');
      },
      error: (error) => {
        console.error('Error en el login:', error);
        alert('Credenciales incorrectas. Por favor, intente de nuevo.');
      }
    });
  }
}
