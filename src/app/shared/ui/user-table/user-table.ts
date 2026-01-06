import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserData } from '../../../shared/models/user.model';

/**
 * Componente: UserTable
 *
 * Descripción:
 *  - Renderiza una tabla de usuarios en formato responsivo.
 *  - Recibe la lista de usuarios desde el componente padre mediante `input()`.
 *  - Emite eventos de edición y eliminación usando `output()`.
 *
 * Características modernas:
 *  - API moderna de Angular (input/output).
 *  - Standalone component.
 *  - Preparado para Angular 17–21.
 *  - Tipado estricto con UserData.
 *
 * Responsabilidad:
 *  - Mostrar datos.
 *  - Emitir acciones.
 *  - No contiene lógica de negocio.
 */
@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-table.html'
})
export class UserTable {

  /**
   * Lista de usuarios a mostrar en la tabla.
   *
   * - Recibido desde el componente padre.
   * - Signal de solo lectura.
   * - Por defecto, un arreglo vacío.
   */
  users = input<UserData[]>([]);

  /**
   * Evento emitido cuando el usuario hace clic en "Editar".
   *
   * Emite:
   *  - El objeto completo del usuario seleccionado.
   */
  edit = output<UserData>();

  /**
   * Evento emitido cuando el usuario hace clic en "Eliminar".
   *
   * Emite:
   *  - El ID del usuario a eliminar.
   */
  delete = output<string>();
}
