import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterOutlet],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {




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
}