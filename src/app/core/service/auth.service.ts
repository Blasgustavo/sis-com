import { Injectable, inject } from '@angular/core';
import {
  signalStore,
  withState,
  withMethods,
  withComputed,
  patchState
} from '@ngrx/signals';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { API } from '../config/api.config';
import { AuthTokenService } from './auth-token.service';
import { UserSignalStore } from './user.signalstore';

@Injectable({ providedIn: 'root' })
export class AuthService extends signalStore(

  // ============================================================
  // STATE
  // ============================================================
  withState({
    loading: false,
    error: null as string | null
  }),

  // ============================================================
  // COMPUTED
  // ============================================================
  withComputed(({ loading, error }) => ({
    isLoading: () => loading(),
    hasError: () => error() !== null,
    errorMessage: () => error() ?? ''
  })),

  // ============================================================
  // METHODS
  // ============================================================
  withMethods((store) => {
    const http = inject(HttpClient);
    const tokenService = inject(AuthTokenService);
    const userStore = inject(UserSignalStore);

    return {

      /**
       * Inicia sesión con credenciales.
       * Guarda el token y carga el usuario desde backend.
       */
      login(user: string, password: string, remember: boolean) {
        patchState(store, { loading: true, error: null });

        return http.post<{ token: string }>(API.login, { user, password }).pipe(
          tap({
            next: (res) => {
              if (!res.token) {
                patchState(store, { loading: false, error: 'Token no recibido' });
                return;
              }

              tokenService.setToken(res.token, remember);

              const username = tokenService.getUsernameFromToken();
              if (username) {
                userStore.loadUserFromBackend(username);
              }

              patchState(store, { loading: false });
            },
            error: () => {
              tokenService.clearToken();
              userStore.clearUser();
              patchState(store, { loading: false, error: 'Credenciales incorrectas' });
            }
          })
        );
      },

      /**
       * Cierra sesión y limpia datos locales.
       */
      logout() {
        tokenService.clearToken();
        userStore.clearUser();
        patchState(store, { error: null });
      },

      /**
       * Verifica si hay sesión activa.
       */
      isLoggedIn(): boolean {
        return tokenService.getToken() !== null;
      },

      /**
       * Establece un mensaje de error manualmente.
       */
      setError(message: string) {
        patchState(store, { error: message });
      },

      /**
       * Limpia el mensaje de error.
       */
      clearError() {
        patchState(store, { error: null });
      }
    };
  })
) {}
