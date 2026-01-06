import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/service/auth.service';
import { NavService } from '../../../core/service/nav.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: '../pages/login.html',
})
export class Login {

  /** Usuario ingresado en el formulario */
  user = '';

  /** Contraseña ingresada */
  password = '';

  /** Recordar sesión (checkbox) */
  remember = false;

  /** Servicios inyectados */
  readonly auth = inject(AuthService);
  readonly nav = inject(NavService);

  /**
   * Maneja el intento de inicio de sesión.
   * Valida campos, ejecuta login y redirige si es exitoso.
   */
  onLogin(): void {
    // Validación básica
    if (!this.user || !this.password) {
      this.auth.setError('Debe ingresar usuario y contraseña');
      return;
    }

    // Ejecutar login
    this.auth.login(this.user, this.password, this.remember).subscribe({
      next: () => {
        // Si hubo error en el AuthService, no navegamos
        if (this.auth.hasError()) return;

        // Login exitoso → navegar
        this.nav.goReplace('/home');
      },
      error: () => {
        this.auth.setError('Error inesperado en el servidor');
      }
    });
  }
}
