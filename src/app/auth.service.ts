import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface UserData {
  dni: string;
  nombres: string;
  apellidos: string;
  numTelefono: string;
  correo?: string;
  rol: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userDataSubject = new BehaviorSubject<UserData | null>(null);
  userData$ = this.userDataSubject.asObservable();

  constructor() {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      this.userDataSubject.next(JSON.parse(storedUserData));
    }
  }

  setUser(userData: UserData) {
    this.userDataSubject.next(userData);
    localStorage.setItem('userData', JSON.stringify(userData));
  }

  clearUser() {
    this.userDataSubject.next(null);
    localStorage.removeItem('userData');
  }

  getUserData(): UserData | null {
    return this.userDataSubject.getValue();
  }

  getUserRole(): string {
    const userData = this.getUserData();
    return userData ? userData.rol : 'error';
  }
}
