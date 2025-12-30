import { ListUsers } from '../user/components/list-users';
import { Component, computed, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserService, UserData } from '../user/services/user.service';
import { NavService } from '../../core/service/nav.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [ RouterOutlet, ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit { 
  // Definimos userSginal para 
  private userSignal = signal<UserData | null>(null);
  // Usamos signals para recuperar datos del servicio
  userName = computed( () => this.userSignal()?.names ?? "")
  userRole = computed( () => this.userSignal()?.role ?? "")
  
  constructor(private userService: UserService, private nav: NavService, private router: Router) {
    // le asignamos los datos almacenados en 
    this.userService.user$.subscribe(user => { this.userSignal.set(user); });
  }
  ngOnInit() {
    const currentUrl = this.router.url;
    if (currentUrl === '/home') {
      setTimeout(() => {
        this.nav.goHidden('/home/homepage');
        }, 0);
     }
  }  
  //ocultamos la navegacion
  goHomepage() {this.nav.goHidden('/home/homepage');}
  goUpdate() {this.nav.goHidden('/home/update');}

  goTaskpage() {this.nav.goHidden('/home/taskpage');}
  goMonitoring() {this.nav.goHidden('/home/monitoringpage');}
  goHistory() {this.nav.goHidden('/home/historypage');}
  
  goReportspage() {this.nav.goHidden('/home/reportspage');}
  goExportspage() {this.nav.goHidden('/home/exportspage');}

  goPerfilpage() {this.nav.goHidden('/home/perfilpage');}
  goUpdateuser() {this.nav.goHidden('/home/updateuser');}

  goListUser() {this.nav.goHidden('/home/listuserpage');}
  goGestionUser(){this.nav.goHidden('/home/gestionuserpage')}

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