import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService , UserData} from '../../../service/user.service';

//import { UserService, UserData } from '../service/user.service';

@Component({
  selector: 'app-update-user',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-user.html',
  styleUrl: './update-user.css',
})

export class UpdateUser implements OnInit {

  perfilForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      names: [''],
      image: [null],
      password: ['', [
        // contraseña OPCIONAL, sin required
        Validators.minLength(8),
        Validators.pattern('(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}')
      ]],
      confirmPassword: [''] // también opcional
    }, { validators: this.passwordsMatchValidator });
  }

  // Solo pedimos coincidencia si hay intento de cambiar contraseña
  passwordsMatchValidator(form: FormGroup) {
    const pass = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;

    // Si ambos vacíos, no hay error
    if (!pass && !confirm) return null;

    // Si uno tiene valor y el otro no, o no coinciden → mismatch
    return pass === confirm ? null : { mismatch: true };
  }
  // el botón se activa si hay cambios válidos
  hasChanges(): boolean {
    const raw = this.perfilForm.getRawValue();

    const passwordTouched = !!raw.password || !!raw.confirmPassword;

    const passwordControl = this.perfilForm.get('password');
    const confirmControl = this.perfilForm.get('confirmPassword');

    const passwordValid = passwordTouched &&
      !!passwordControl?.valid &&
      !!confirmControl?.valid &&
      !this.perfilForm.hasError('mismatch');

    return !!raw.names || !!raw.image || passwordValid;
  }
  // Manejo del archivo
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    const control = this.perfilForm.get('image');
    if (control && file) {
      control.setValue(file);
    }
  }

  // Enviar datos actualizados
  onSubmit(): void {
    if (!this.hasChanges()) return;

    const raw = this.perfilForm.getRawValue();
    const update: Partial<UserData> = {};

    if (raw.names) update.names = raw.names;
    if (raw.image) update.image = raw.image;
    if (raw.password) update.password = raw.password;

    const username = this.userService.getUser()?.user;
    if (!username) return;

    this.userService.updateUserByUsername(username, update).subscribe({
      next: updated => this.userService.updateUser(updated),
      error: err => console.error('Error al actualizar usuario en el servidor', err)
    });
  }

}
