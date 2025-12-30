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
import { UserData } from '../services/user.service';

@Component({
  selector: 'app-gestion-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: '../pages/gestion-user.html'
})
export class GestionUser implements OnInit {

  // ============================================================
  // Inyección de dependencias
  // ============================================================
  private fb = inject(FormBuilder);
  private userService = inject(UserListService);

  // ============================================================
  // Estado reactivo con Signals
  // ============================================================
  users = signal<UserData[]>([]);
  selectedUser = signal<UserData | null>(null);

  // ============================================================
  // Tipado fuerte del formulario
  // ============================================================
  form: FormGroup<{
    user: FormControl<string>;
    names: FormControl<string>;
    role: FormControl<string>;
    password: FormControl<string>;
    image: FormControl<string>;
  }> = this.fb.group({
    user: this.fb.control('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    names: this.fb.control('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    role: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
    password: this.fb.control('', { nonNullable: true, validators: [Validators.minLength(6)] }),
    image: this.fb.control('', { nonNullable: true })
  });

  // ============================================================
  // Ciclo de vida
  // ============================================================
  ngOnInit() {
    this.loadUsers();
  }

  // ============================================================
  // Cargar lista de usuarios desde el backend
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
    this.form.patchValue({
      user: user.user,
      names: user.names,
      role: user.role,
      password: '',
      image: ''
    });
  }

  // ============================================================
  // Limpiar selección y formulario
  // ============================================================
  clearSelection(): void {
    this.selectedUser.set(null);
    this.form.reset();
  }

  // ============================================================
  // Guardar usuario (crear o editar)
  // ============================================================
  saveUser(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // 🔥 fuerza mostrar errores
      console.warn('⚠️ Formulario inválido');
      return;
    }

    const payload = this.form.getRawValue();
    const editing = this.selectedUser() !== null;

    console.log(editing ? '✏️ Editando usuario:' : '🆕 Creando usuario:', payload);

    // Aquí conectas tu API:
    // editing ? this.updateUser(payload) : this.createUser(payload);
  }

  // ============================================================
  // Eliminar usuario
  // ============================================================
  deleteUser(id: string): void {
    console.log('🗑️ Eliminando usuario:', id);

    // Aquí conectas tu API:
    // this.userService.deleteUser(id).subscribe(...)
  }

  // ============================================================
  // Validación visual para inputs
  // ============================================================
  isInvalid<K extends keyof typeof this.form.controls>(control: K): boolean {
    const c = this.form.controls[control];
    return c.touched && c.invalid;
  }
}
