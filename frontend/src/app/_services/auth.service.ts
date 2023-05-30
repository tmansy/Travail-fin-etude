import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setToken(token: string) {
    return localStorage.setItem('token', token);
  }

  isTokenValid(): boolean {
    const token = this.getToken();

    if (token) {
      try {
        const decodedToken: any = jwt_decode(token);
        const currentTimestamp = Math.floor(Date.now() / 1000);

        if (decodedToken.exp < currentTimestamp) {
          return false; // Token expiré
        }

        return true; // Token valide
      } catch (error) {
        return false; // Erreur de décodage du token
      }
    }

    return false; // Pas de token disponible
  }
}
