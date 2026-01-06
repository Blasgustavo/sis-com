import { Injectable, inject } from '@angular/core';
import {
  signalStore,
  withState,
  withMethods,
  withComputed,
  patchState
} from '@ngrx/signals';
import { HttpClient } from '@angular/common/http';
import { API } from '../config/api.config';
import { UserData } from '../../shared/models/user.model';

/**
 * Store: UserStore
 *
 * Responsabilidad:
 *  Manejar el estado global del usuario autenticado.
 *
 * Funciones principales:
 *  - Guardar usuario
 *  - Limpiar usuario
 *  - Cargar usuario desde backend
 *
 * Características:
 *  - Reemplaza UserService
 *  - Usa Signal Store para estado reactivo y limpio
 *  - Computed para exponer datos derivados
 */
@Injectable({ providedIn: 'root' })
export class UserStore extends signalStore(

  // ============================================================
  // STATE
  // ============================================================
  withState({
    user: null as UserData | null,
    loading: false,
    error: null as string | null
  }),

  // ============================================================
  // COMPUTED
  // ============================================================
  withComputed(({ user, loading, error }) => ({
    userName: () => user()?.names ?? '',
    userRole: () => user()?.role ?? '',
    userImage: () => user()?.image ?? '',
    isLoaded: () => user() !== null,
    isLoading: () => loading(),
    hasError: () => error() !== null
  })),

  // ============================================================
  // METHODS
  // ============================================================
  withMethods((store) => {
    const http = inject(HttpClient);

    return {
      /**
       * Guarda el usuario en el estado.
       */
      setUser(user: UserData) {
        patchState(store, { user, loading: false, error: null });
      },

      /**
       * Limpia el usuario del estado.
       */
      clearUser() {
        patchState(store, { user: null, loading: false, error: null });
      },

      /**
       * Carga el usuario desde backend usando su username.
       */
      loadUserFromBackend(username: string) {
        patchState(store, { loading: true, error: null });

        http.get<UserData>(`${API.users}/${username}`).subscribe({
          next: (data) => {
            patchState(store, { user: data, loading: false });
          },
          error: () => {
            patchState(store, { user: null, loading: false, error: 'No se pudo cargar el usuario' });
          }
        });
      }
    };
  })
) {}
