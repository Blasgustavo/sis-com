import { environment } from '../../../environments/environment';

/**
 * Configuración centralizada de endpoints del backend.
 *
 * Cada módulo del backend debe tener su propia sección.
 * Esto permite mantener URLs limpias, escalables y fáciles de mantener.
 */
export const API = {
  // ============================================================
  // Módulo de Usuarios
  // ============================================================
  users: `${environment.apiUrl}/users/`,

  /**
   * Obtener usuario por username
   * Ejemplo: API.userByUsername('juan') → http://localhost:3000/api/users/juan
   */
  userByUsername: (username: string) =>
    `${environment.apiUrl}/users/${username}`,

  // ============================================================
  // Módulo de Autenticación
  // ============================================================
  auth: `${environment.apiUrl}/auth/`,

  /**
   * Endpoint de login
   * Ejemplo: API.login → http://localhost:3000/api/auth/login
   */
  login: `${environment.apiUrl}/auth/login`,

  // ============================================================
  // Módulo de Reportes
  // ============================================================
  reports: `${environment.apiUrl}/reports/`,

  // ============================================================
  // Módulo de Programación
  // ============================================================
  programation: `${environment.apiUrl}/programation/`

  // Agrega más módulos según tu backend
};
