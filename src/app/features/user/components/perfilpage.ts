import { Component, signal, computed } from '@angular/core';
import { UserData, UserService } from '../services/user.service';

@Component({
  selector: 'app-perfilpage',
  imports: [],
  templateUrl: '../pages/perfilpage.html',
  styleUrl: '../pages/perfilpage.css',
})
export class Perfilpage {
  // Definimos userSginal para 
  private userSignal = signal<UserData | null>(null);
  // Usamos signals para recuperar datos del servicio
  userUser = computed( () => this.userSignal()?.user ?? "")
  userRole = computed( () => this.userSignal()?.role ?? "")
  userImage = computed( () => this.userSignal()?.image ?? "")
  userNames = computed( () => this.userSignal()?.names ?? "")
  
  constructor(private userService: UserService) {
    // le asignamos los datos almacenados en 
    this.userService.user$.subscribe(user => { this.userSignal.set(user); });
  }

}
