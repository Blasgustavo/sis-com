import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl
} from '@angular/forms';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-update-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: '../pages/update-user.html',
})
export class UpdateUser implements OnInit {

  private fb = inject(FormBuilder);
  public userService = inject(UserService);

  // Signals
  showModal = signal(false);
  previewUrl = signal<string | null>(null);
  isLoadingImage = signal(false);

  perfilForm!: FormGroup<{
    names: FormControl<string>;
    image: FormControl<File | null>;
    password: FormControl<string>;
    confirmPassword: FormControl<string>;
  }>;

  confirmForm!: FormGroup<{
    currentPassword: FormControl<string>;
  }>;

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      names: this.fb.control('', { nonNullable: true }),
      image: this.fb.control<File | null>(null),
      password: this.fb.control('', {
        nonNullable: true,
        validators: [Validators.pattern(/^[A-Za-z0-9]{4,}$/)]
      }),
      confirmPassword: this.fb.control('', { nonNullable: true })
    }, { validators: this.passwordsMatchValidator });

    this.confirmForm = this.fb.group({
      currentPassword: this.fb.control('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(4)]
      })
    });
  }

  private passwordsMatchValidator(form: FormGroup) {
    const pass = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;

    if (!pass && !confirm) return null;
    return pass === confirm ? null : { mismatch: true };
  }

  hasChanges(): boolean {
    const raw = this.perfilForm.getRawValue();

    const namesChanged = raw.names.trim().length > 0;
    const imageChanged = raw.image instanceof File;
    const passwordTouched = !!raw.password || !!raw.confirmPassword;
    const passwordValid = passwordTouched && !this.perfilForm.hasError('mismatch');

    return namesChanged || imageChanged || passwordValid;
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      this.previewUrl.set(null);
      this.perfilForm.controls.image.setValue(null);
      return;
    }

    this.isLoadingImage.set(true);
    this.perfilForm.controls.image.setValue(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;

      if (result?.startsWith('data:image')) {
        this.previewUrl.set(result);
      } else {
        console.warn('Archivo no es una imagen válida');
        this.previewUrl.set(null);
      }

      this.isLoadingImage.set(false);
    };

    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    if (!this.hasChanges()) return;
    this.showModal.set(true);
  }

  cancelUpdate(): void {
    this.confirmForm.reset();
    this.showModal.set(false);
  }

  confirmUpdate(): void {
    if (this.confirmForm.invalid) {
      alert('Debes ingresar tu contraseña actual para confirmar.');
      return;
    }

    const raw = this.perfilForm.getRawValue();
    const formData = new FormData();

    if (raw.names.trim()) formData.append('names', raw.names.trim());
    if (raw.password.trim()) formData.append('password', raw.password.trim());
    if (raw.image instanceof File) formData.append('image', raw.image);

    const currentPassword = this.confirmForm.value.currentPassword?.trim();
    if (!currentPassword) {
      alert('Debes ingresar tu contraseña actual para confirmar.');
      return;
    }
    formData.append('currentPassword', currentPassword);

    const username = this.userService.user()?.user;
    if (!username) {
      alert('No se pudo obtener el usuario actual.');
      return;
    }

    // Nuevo método del UserService (Signals)
    this.userService.updateUser(username, formData).subscribe({
      next: updated => {
        // Actualiza el estado global con Signals
        this.userService['setLocalUser'](updated);
        this.cancelUpdate();
      },
      error: err => {
        console.error('Error al actualizar usuario', err);
        alert('Error al validar la contraseña o subir la imagen. Intenta nuevamente.');
      }
    });
  }
}