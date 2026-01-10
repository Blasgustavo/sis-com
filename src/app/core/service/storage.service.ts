import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {

  /** Verifica si estamos en entorno navegador (evita errores SSR) */
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && !!window.localStorage;
  }

  /** Guarda un valor string */
  set(key: string, value: string): void {
    if (this.isBrowser()) {
      localStorage.setItem(key, value);
    }
  }

  /** Obtiene un valor string */
  get(key: string): string | null {
    return this.isBrowser() ? localStorage.getItem(key) : null;
  }

  /** Elimina una clave */
  remove(key: string): void {
    if (this.isBrowser()) {
      localStorage.removeItem(key);
    }
  }

  /** Guarda un objeto como JSON */
  setObject<T>(key: string, value: T): void {
    if (this.isBrowser()) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  /** Obtiene un objeto como JSON */
  getObject<T>(key: string): T | null {
    if (!this.isBrowser()) return null;
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : null;
  }

  /** Limpia todo el localStorage */
  clear(): void {
    if (this.isBrowser()) {
      localStorage.clear();
    }
  }
}
