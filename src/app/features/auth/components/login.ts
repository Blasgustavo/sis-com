import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/service/auth.service';
import { NavService } from '../../../core/service/nav.service';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../../core/service/storage.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: '../pages/login.html',
})
export class Login implements OnInit {

  /** Nombre de usuario ingresado en el formulario */
  user = '';

  /** Contraseña ingresada por el usuario */
  password = '';

  /** Indica si el usuario desea recordar sus datos */
  remember = false;

  /** Servicios inyectados */
  readonly auth = inject(AuthService);
  readonly nav = inject(NavService);
  readonly storage = inject(StorageService);

  /**
   * Al inicializar el componente:
   * - Carga el último usuario guardado en localStorage (si existe)
   * - Evita errores en SSR verificando que window esté disponible
   */
  ngOnInit(): void {
      const usuario = this.storage.get('usuario')
      if (usuario) {
        this.user = usuario;
        this.remember = true;
      }
  }

  /**
   * Valida los campos antes de enviar al backend.
   * Retorna true si todo está correcto.
   */
  private validarFormulario(): boolean {
    // Usuario vacío
    if (!this.user.trim()) {
      this.auth.setError('Debe ingresar un nombre de usuario');
      return false;
    }

    // Contraseña vacía
    if (!this.password.trim()) {
      this.auth.setError('Debe ingresar una contraseña');
      return false;
    }

    // Longitud mínima usuario
    if (this.user.length < 3) {
      this.auth.setError('El usuario debe tener al menos 3 caracteres');
      return false;
    }

    // Longitud mínima contraseña
    if (this.password.length < 4) {
      this.auth.setError('La contraseña debe tener al menos 8 caracteres');
      return false;
    }

    // Validación de caracteres permitidos en usuario
    const regexUser = /^[a-zA-Z0-9._-]+$/;
    if (!regexUser.test(this.user)) {
      this.auth.setError('El usuario solo puede contener letras, números, puntos, guiones y guiones bajos');
      return false;
    }

    return true;
  }

  /**
   * Maneja el intento de inicio de sesión:
   * - Ejecuta validaciones previas
   * - Llama al backend
   * - Guarda o elimina el usuario recordado
   * - Navega si el login es exitoso
   */
  onLogin(): void {
    // Validaciones previas al backend
    if (!this.validarFormulario()) return;

    // Ejecutar login
    this.auth.login(this.user, this.password, this.remember).subscribe({
      next: () => {
        // Si hubo error en el AuthService, no navegamos
        if (this.auth.hasError()) return;
        /**
         * Guardar el usuario si el checkbox está marcado.
         * Si no está marcado, se elimina cualquier usuario guardado previamente.
         */
        if (this.remember) {
            this.storage.set('usuario', this.user);
          } else {
            this.storage.remove('usuario');
          }
        // Login exitoso → navegar
        this.nav.goReplace('/home');
      },
      error: () => {
        this.auth.setError('Error inesperado en el servidor');
      }
    });
  }
}
