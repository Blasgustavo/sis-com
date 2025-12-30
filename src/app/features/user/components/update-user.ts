import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-update-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: '../pages/update-user.html',
  styleUrl: '../pages/update-user.css',
})
export class UpdateUser implements OnInit {

  perfilForm!: FormGroup;
  confirmForm!: FormGroup;

  showModal = false;
  previewUrl: string | null = null;
  isLoadingImage = false;

  constructor(
    private fb: FormBuilder,
    public userService: UserService // 🔧 debe ser público para usarlo en el HTML
  ) {}

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      names: [''],
      image: [null],
      password: ['', [Validators.pattern(/^[A-Za-z0-9]{4,}$/)]],
      confirmPassword: ['']
    }, { validators: this.passwordsMatchValidator });

    this.confirmForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  passwordsMatchValidator(form: FormGroup) {
    const pass = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;
    if (!pass && !confirm) return null;
    return pass === confirm ? null : { mismatch: true };
  }

  hasChanges(): boolean {
    if (!this.perfilForm) return false;
    const raw = this.perfilForm.getRawValue();
    const passwordTouched = !!raw.password || !!raw.confirmPassword;
    const passwordValid = passwordTouched && !this.perfilForm.hasError('mismatch');
    const namesChanged = typeof raw.names === 'string' && raw.names.trim().length > 0;
    const imageChanged = !!raw.image;
    return Boolean(namesChanged || imageChanged || passwordValid);
  }

    onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      this.previewUrl = null;
      this.perfilForm.get('image')?.setValue(null);
      return;
    }

    this.isLoadingImage = true;
    this.perfilForm.get('image')?.setValue(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      if (result?.startsWith('data:image')) {
        this.previewUrl = result;
      } else {
        console.warn('Archivo no es una imagen válida');
        this.previewUrl = null;
      }
      this.isLoadingImage = false;
    };
    reader.readAsDataURL(file);
  }


  onSubmit(): void {
    if (!this.hasChanges()) return;
    this.showModal = true;
  }

  cancelUpdate(): void {
    this.confirmForm.reset();
    this.showModal = false;
  }

  confirmUpdate(): void {
    if (this.confirmForm.invalid) {
      alert('🪧 Debes ingresar tu contraseña actual para confirmar.');
      return;
    }

    const currentPassword = this.confirmForm.value.currentPassword;
    const raw = this.perfilForm.getRawValue();
    const formData = new FormData();

    if (typeof raw.names === 'string' && raw.names.trim().length > 0) {
      formData.append('names', raw.names.trim());
    }

    formData.append('currentPassword', currentPassword);

    if (raw.password?.trim()) {
      formData.append('password', raw.password.trim());
    }

    if (raw.image instanceof File && raw.image.size > 0) {
      formData.append('image', raw.image);
    }

    const username = this.userService.getUser()?.user;
    if (!username) {
      alert('No se pudo obtener el usuario actual.');
      return;
    }

    this.userService.updateUserByUsername(username, formData).subscribe({
      next: updated => {
        this.userService.updateLocalUser(updated);
        this.cancelUpdate();
      },
      error: err => {
        console.error('Error al actualizar usuario', err);
        alert('Error al validar la contraseña o subir la imagen. Intenta nuevamente.');
      }
    });
  }
}
