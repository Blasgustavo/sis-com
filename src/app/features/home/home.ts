import { Component, OnInit, signal, computed, effect } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';

import { UserService } from '../user/services/user.service';
import { NavService } from '../../core/service/nav.service';
import { UserData } from '../../shared/models/user.model';

/**
 * Componente: Home
 *
 * Descripción:
 *  Vista principal del sistema.
 *  Muestra navegación lateral y gestiona rutas internas.
 *  Recupera datos del usuario autenticado desde UserService.
 *
 * Características modernas:
 *  - Signals para estado reactivo
 *  - Computed para nombre y rol
 *  - Navegación desacoplada con NavService
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  /**
   * Signal local con el usuario autenticado.
   * Se actualiza desde el UserService.
   */
  private userSignal = signal<UserData | null>(null);

  /**
   * Nombre del usuario autenticado.
   */
  userName = computed(() => this.userSignal()?.names ?? '');

  /**
   * Rol del usuario autenticado.
   */
  userRole = computed(() => this.userSignal()?.role ?? '');

  constructor(
    private userService: UserService,
    private nav: NavService,
    private router: Router
  ) {
    // Reacciona a cambios en el signal global del usuario
    effect(() => {
      this.userSignal.set(this.userService.user());
    });
  }

  ngOnInit(): void {
    const currentUrl = this.router.url;
    if (currentUrl === '/home') {
      setTimeout(() => {
        this.nav.goHidden('/home/homepage');
      }, 0);
    }
  }

  // ============================================================
  // Navegación principal
  // ============================================================

  goHomepage() { this.nav.goHidden('/home/homepage'); }
  goUpdate() { this.nav.goHidden('/home/update'); }
  goTaskpage() { this.nav.goHidden('/home/taskpage'); }
  goMonitoring() { this.nav.goHidden('/home/monitoringpage'); }
  goHistory() { this.nav.goHidden('/home/historypage'); }
  goReportspage() { this.nav.goHidden('/home/reportspage'); }
  goExportspage() { this.nav.goHidden('/home/exportspage'); }
  goPerfilpage() { this.nav.goHidden('/home/perfilpage'); }
  goUpdateuser() { this.nav.goHidden('/home/updateuser'); }
  goListUser() { this.nav.goHidden('/home/listuserpage'); }
  goGestionUser() { this.nav.goHidden('/home/gestionuserpage'); }

  // ============================================================
  // Estado del menú lateral
  // ============================================================

  isOpenMenu = false;
  toggleMenu() { this.isOpenMenu = !this.isOpenMenu; }

  isTdinicio = false;
  tdInicio() { this.isTdinicio = !this.isTdinicio; }

  isTdprogramacion = false;
  tdProgramacion() { this.isTdprogramacion = !this.isTdprogramacion; }

  isTdreportes = false;
  tdReportes() { this.isTdreportes = !this.isTdreportes; }

  isTdperfil = false;
  tdPerfil() { this.isTdperfil = !this.isTdperfil; }

  isTdAyuda = false;
  tdAyuda() { this.isTdAyuda = !this.isTdAyuda; }

  isTdconfi = false;
  tdConfi() { this.isTdconfi = !this.isTdconfi; }
}
