/**
 * Modelo: TokenPayload
 *
 * Representa la estructura del payload del JWT.
 * Los campos `iat` y `exp` dependen de cómo el backend firme el token.
 */
export interface TokenPayload {
  id: string;
  user: string;
  role: string;
  iat?: number;
  exp?: number;
}
