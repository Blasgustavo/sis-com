import { Component, signal, computed, effect } from '@angular/core';
import { UserService } from '../services/user.service';
import { UserData } from '../../../shared/models/user.model';

@Component({
  selector: 'app-perfilpage',
  standalone: true,
  imports: [],
  templateUrl: '../pages/perfilpage.html',
})
export class Perfilpage {

  // Estado local del usuario
  private userSignal = signal<UserData | null>(null);

  // Campos derivados
  userUser  = computed(() => this.userSignal()?.user  ?? "");
  userRole  = computed(() => this.userSignal()?.role  ?? "");
  userImage = computed(() => this.userSignal()?.image ?? "");
  userNames = computed(() => this.userSignal()?.names ?? "");

  constructor(private userService: UserService) {

    // Reacciona automáticamente a cambios en el UserService
    effect(() => {
      this.userSignal.set(this.userService.user());
    });
  }
}
