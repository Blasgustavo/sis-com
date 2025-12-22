import { Component, computed, OnInit, signal } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref } from '@angular/router';
import { UserService, UserData } from '../../service/user.service';
import { Observable } from 'rxjs';
import { NgIf, AsyncPipe} from '@angular/common'

@Component({
  selector: 'app-home',
  imports: [ RouterOutlet, RouterLinkWithHref,],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  // Definimos userSginal para 
  private userSignal = signal<UserData | null>(null);
  // Usamos signals para recuperar datos del servicio
  userName = computed( () => this.userSignal()?.names ?? "")
  userRole = computed( () => this.userSignal()?.role ?? "")
  
  constructor(private userService: UserService) {
    // le asignamos los datos almacenados en 
    this.userService.user$.subscribe(user => { this.userSignal.set(user); });
  }
  
  // Menu toggle
  isOpenMenu = false;
  toggleMenu() {
    this.isOpenMenu = !this.isOpenMenu;
  }
  // Navegación menu inicio
  isTdinicio = false;
  tdInicio() {
    this.isTdinicio = !this.isTdinicio;
  }
  // Navegacion menu programacion
  isTdprogramacion = false;
  tdProgramacion() {
    this.isTdprogramacion = !this.isTdprogramacion;
  }
  // Navegacion menu reportes
  isTdreportes = false;
  tdReportes() {
    this.isTdreportes = !this.isTdreportes;
  }
  // Navegacion menu perfil
  isTdperfil = false;
  tdPerfil() {
    this.isTdperfil = !this.isTdperfil;
  }
  // Navegacion menu ayuda
  isTdAyuda = false;
  tdAyuda() {
    this.isTdAyuda = !this.isTdAyuda;
  }
  // Navegacion menu configuracion
  isTdconfi = false;
  tdConfi() {
    this.isTdconfi = !this.isTdconfi;
  }
}