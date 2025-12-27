import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService, UpdatePayload } from '../services/user.service';

@Component({
  selector: 'app-update-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: '../pages/update-user.html',
  styleUrl: '../pages/update-user.css',
})
export class UpdateUser implements OnInit {

  // Formulario principal
  perfilForm!: FormGroup;

  // Formulario del modal
  confirmForm!: FormGroup;

  // Controla visibilidad del modal
  showModal = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // Inicializa formulario principal
    this.perfilForm = this.fb.group({
      names: [''],
      image: [null],
      password: ['', [
        Validators.pattern(/^[A-Za-z0-9]{4,}$/) // mínimo 4 caracteres, solo letras y números
      ]],
      confirmPassword: ['']
    }, { validators: this.passwordsMatchValidator });

    // Inicializa formulario del modal
    this.confirmForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  // Valida que las contraseñas coincidan
  passwordsMatchValidator(form: FormGroup) {
    const pass = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;
    if (!pass && !confirm) return null;
    return pass === confirm ? null : { mismatch: true };
  }

  // Detecta si hay cambios válidos en el formulario
  hasChanges(): boolean {
    if (!this.perfilForm) return false;
    const raw = this.perfilForm.getRawValue();
    const passwordTouched = !!raw.password || !!raw.confirmPassword;
    const passwordValid = passwordTouched && !this.perfilForm.hasError('mismatch');
    const namesChanged = typeof raw.names === 'string' && raw.names.trim().length > 0;
    const imageChanged = !!raw.image;
    return Boolean(namesChanged || imageChanged || passwordValid);
  }

  // Maneja el cambio de imagen
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.perfilForm.get('image')?.setValue(file);
    }
  }

  // Abre el modal si hay cambios
  onSubmit(): void {
    if (!this.hasChanges()) return;
    this.showModal = true;
  }

  // Cierra el modal y limpia el campo
  cancelUpdate(): void {
    this.confirmForm.reset();
    this.showModal = false;
  }

  // Confirma la actualización y envía al backend
  confirmUpdate(): void {
    if (this.confirmForm.invalid) {
      alert('Debes ingresar tu contraseña actual para confirmar.');
      return;
    }

    const currentPassword = this.confirmForm.value.currentPassword;
    const raw = this.perfilForm.getRawValue();

    const update: UpdatePayload = {
      names: raw.names,
      image: raw.image,
      password: raw.password,
      currentPassword
    };

    const username = this.userService.getUser()?.user;
    if (!username) return;

    this.userService.updateUserByUsername(username, update).subscribe({
      next: updated => {
        this.userService.updateUser(updated);
        this.cancelUpdate();
      },
      error: err => {
        console.error('Error al actualizar usuario', err);
        alert('Error al validar la contraseña. Intenta nuevamente.');
      }
    });
  }
}
