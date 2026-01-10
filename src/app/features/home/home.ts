/**
 * Componente: Home
 * --------------------------------------------------------------
 * Vista principal del sistema.
 *
 * Responsabilidades:
 *  - Renderizar la estructura base del sistema (sidebar + contenido).
 *  - Gestionar navegación interna mediante NavService.
 *  - Exponer datos del usuario autenticado usando Signals.
 *  - Controlar el estado visual del menú lateral.
 *  - Gestionar el tema visual (DaisyUI) mediante Angular Signals.
 *
 * Tecnologías modernas aplicadas:
 *  - Signals → Estado reactivo sin necesidad de RxJS.
 *  - Computed → Derivación reactiva de datos del usuario.
 *  - Effect → Sincronización automática con el DOM (tema visual).
 *  - Standalone Components → Arquitectura moderna Angular.
 *  - SSR-safe → Protección contra errores en renderizado del servidor.
 */

import { Component, OnInit, signal, computed, effect, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

import { UserService } from '../user/services/user.service';
import { NavService } from '../../core/service/nav.service';
import { UserData } from '../../shared/models/user.model';

import { AuthService } from '../../core/service/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {

  // ============================================================
  // Estado del usuario autenticado
  // ============================================================

  /** Signal que almacena el usuario autenticado. */
  private userSignal = signal<UserData | null>(null);

  /** Nombre del usuario autenticado (derivado). */
  userName = computed(() => this.userSignal()?.names ?? '');

  /** Rol del usuario autenticado (derivado). */
  userRole = computed(() => this.userSignal()?.role ?? '');

  // ============================================================
  // Tema visual (DaisyUI + Angular Signals)
  // ============================================================

  /** Signal que controla el tema visual actual. */
  theme = signal<'light' | 'dark'>('light');

  constructor(
    private userService: UserService,
    private nav: NavService,
    private router: Router,
    private auth: AuthService
  ) {
    const platformId = inject(PLATFORM_ID);

    /** Mantiene sincronizado el usuario local con el UserService. */
    effect(() => {
      this.userSignal.set(this.userService.user());
    });

    /** Aplica el tema visual al <html> solo si estamos en el navegador. */
    effect(() => {
      if (isPlatformBrowser(platformId)) {
        document.documentElement.setAttribute('data-theme', this.theme());
      }
    });
  }

  /**
   * Cambia el tema según el estado del checkbox.
   * @param checked - Estado del toggle (true = dark, false = light)
   */
  toggleTheme(checked: boolean) {
    this.theme.set(checked ? 'dark' : 'light');
  }

  // ============================================================
  // Navegación principal
  // ============================================================

  ngOnInit(): void {
    /** Redirección automática si el usuario entra a /home directamente. */
    if (this.router.url === '/home') {
      setTimeout(() => {
        this.nav.goHidden('/home/homepage');
      }, 0);
    }
  }

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

  /** Controla apertura/cierre del menú lateral */
  isOpenMenu = false;
  toggleMenu() { this.isOpenMenu = !this.isOpenMenu; }

  /** Submenús */
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

    logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }


}
