import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavService {

  constructor(private router: Router) {}

  // Navegar sin mostrar la ruta en la barra del navegador
  goHidden(url: string) {
    this.router.navigate([url], { skipLocationChange: true });
  }

  // Navegar reemplazando la URL (no queda en historial)
  goReplace(url: string) {
    this.router.navigate([url], { replaceUrl: true });
  }

  // Navegación normal
  go(url: string) {
    this.router.navigate([url]);
  }
}