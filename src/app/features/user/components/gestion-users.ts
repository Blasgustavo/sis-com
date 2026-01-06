import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
  FormControl
} from '@angular/forms';
import { UserListService } from '../services/user-list.service';
import { UserData } from '../../../shared/models/user.model';

// Componentes UI
import { UserTable } from '../../../shared/ui/user-table/user-table';
import { UserForm } from '../../../shared/ui/user-form/user-form';

/**
 * Componente: GestionUser
 *
 * Descripción:
 *  Vista principal para la gestión de usuarios.
 *  Maneja:
 *    - Listado de usuarios
 *    - Selección para edición
 *    - Formulario reactivo
 *    - CRUD completo
 *
 * Características modernas:
 *  - Signals para estado reactivo
 *  - Formulario tipado
 *  - API moderna Angular 17–21
 *  - Standalone component
 */
@Component({
  selector: 'app-gestion-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UserTable, UserForm],
  templateUrl: '../pages/gestion-user.html'
})
export class GestionUser implements OnInit {

  private fb = inject(FormBuilder);
  private userService = inject(UserListService);

  /**
   * Lista de usuarios cargados desde el backend.
   * Se actualiza con signals.
   */
  users = signal<UserData[]>([]);

  /**
   * Usuario seleccionado para edición.
   * Si es null → modo creación.
   */
  selectedUser = signal<UserData | null>(null);

  /**
   * Formulario reactivo tipado.
   * Se envuelve en un signal para ser compatible con input() del UserForm.
   */
  form = signal<FormGroup<{
    user: FormControl<string>;
    names: FormControl<string>;
    role: FormControl<string>;
    password: FormControl<string>;
    image: FormControl<File | null>;
  }>>(this.fb.group({
    user: this.fb.control('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    names: this.fb.control('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    role: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
    password: this.fb.control('', { nonNullable: true, validators: [Validators.minLength(6)] }),
    image: this.fb.control<File | null>(null)
  }));

  ngOnInit() {
    this.loadUsers();
  }

  // ============================================================
  // Cargar usuarios
  // ============================================================
  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: data => this.users.set(data),
      error: err => console.error('🚫 Error cargando usuarios', err)
    });
  }

  // ============================================================
  // Seleccionar usuario para edición
  // ============================================================
  selectUser(user: UserData): void {
    this.selectedUser.set(user);

    this.form().patchValue({
      user: user.user,
      names: user.names,
      role: user.role,
      password: '',
      image: null
    });
  }

  // ============================================================
  // Limpiar selección
  // ============================================================
  clearSelection(): void {
    this.selectedUser.set(null);
    this.form().reset();
  }

  // ============================================================
  // Guardar usuario (crear o editar)
  // ============================================================
  saveUser(): void {
    const form = this.form();

    if (form.invalid) {
      form.markAllAsTouched();
      console.warn('⚠️ Formulario inválido');
      return;
    }

    const payload = form.getRawValue();
    const editing = this.selectedUser() !== null;

    const formData = new FormData();
    formData.append('user', payload.user.trim());
    formData.append('names', payload.names.trim());
    formData.append('role', payload.role);

    if (payload.password.trim()) {
      formData.append('password', payload.password.trim());
    }

    if (payload.image instanceof File) {
      formData.append('image', payload.image);
    }

    if (editing) {
      const id = this.selectedUser()!.id;

      this.userService.updateUser(id, formData).subscribe({
        next: updated => {
          console.log('✏️ Usuario actualizado:', updated);

          this.users.update(list =>
            list.map(u => (u.id === updated.id ? updated : u))
          );

          this.clearSelection();
        },
        error: err => {
          console.error('🚫 Error al actualizar usuario', err);
          alert('No se pudo actualizar el usuario.');
        }
      });

      return;
    }

    // Crear usuario
    this.userService.createUser(formData).subscribe({
      next: created => {
        console.log('🆕 Usuario creado:', created);
        this.users.update(list => [...list, created]);
        form.reset();
      },
      error: err => {
        console.error('🚫 Error al crear usuario', err);
        alert('No se pudo crear el usuario.');
      }
    });
  }

  // ============================================================
  // Eliminar usuario
  // ============================================================
  deleteUser(id: string): void {
    if (!confirm('¿Seguro que deseas eliminar este usuario?')) return;

    this.userService.deleteUser(id).subscribe({
      next: () => {
        console.log('🗑️ Usuario eliminado:', id);
        this.users.update(list => list.filter(u => u.id !== id));
      },
      error: err => {
        console.error('🚫 Error al eliminar usuario', err);
        alert('No se pudo eliminar el usuario.');
      }
    });
  }
}
