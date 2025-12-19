import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  //Definicion de variables para el usuario y la contraseña
  user: string = '';
  pasword: string = '';
  //Inyeccion del router en el constructor
  constructor(private authService: AuthService, private router:Router) {}
  //Metodo para manejar el evento de login
  onLogin() {
    console.log("Intentando iniciar sesion con usuario:", this.user);
    this.authService.login(this.user, this.pasword).subscribe({
      next: (response) => {
        console.log('Login exitoso:', response);
        localStorage.setItem('authToken', response.token);
        //Navegacion a la pagina Home despues del login
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Error en el login:', error);
        alert('Credenciales incorrectas. Por favor, intente de nuevo.');
      }
    });
  }
}
