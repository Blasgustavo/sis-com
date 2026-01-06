import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { UserData } from '../../../shared/models/user.model';

/**
 * Componente: UserForm
 *
 * Descripción:
 *  Formulario reactivo para crear o editar usuarios.
 *  Recibe un FormGroup externo y un usuario seleccionado (opcional).
 *  Emite eventos de guardado y cancelación al componente padre.
 *
 * Características modernas:
 *  - API moderna de Angular: input() y output().
 *  - Standalone component.
 *  - Preparado para Angular 17–21.
 *  - Sin EventEmitter (reemplazado por output()).
 *
 * Responsabilidad:
 *  - Mostrar y validar el formulario.
 *  - Emitir acciones al componente padre.
 *  - No contiene lógica de negocio.
 */
@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.html'
})
export class UserForm {

  /**
   * Formulario reactivo recibido desde el componente padre.
   * Se accede en el template como: form()
   * Debe contener los campos:
   *  - user
   *  - names
   *  - role
   *  - password
   *  - image
   */
  form = input.required<FormGroup>();

  /**
   * Usuario seleccionado para edición.
   * Si es null, el formulario funciona en modo "crear".
   * Se accede en el template como: selectedUser()
   */
  selectedUser = input<UserData | null>(null);

  /**
   * Evento emitido cuando el usuario hace clic en "Guardar".
   * No envía payload; el padre debe leer los valores del FormGroup.
   */
  save = output<void>();

  /**
   * Evento emitido cuando el usuario cancela la edición.
   */
  cancel = output<void>();
}
