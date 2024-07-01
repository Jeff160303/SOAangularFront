import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService, UserData } from '../../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginObj: Login;

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {
    this.loginObj = { correo: '', contrasena: '' };
  }

  onLogin() {
    this.http
      .post<UserData>('http://localhost:8090/usuarios/iniciarSesion', this.loginObj)
      .subscribe(
        (userData: UserData) => {
          if (userData.rol !== 'error') {
            this.authService.setUser(userData);
            Swal.fire({
              title: 'Bienvenido!',
              text: 'Acceso correcto!',
              icon: 'success',
            });
            this.router.navigateByUrl('/');
          } else {
            Swal.fire({
              title: 'Error!',
              text: 'Credenciales incorrectas!',
              icon: 'error',
            });
          }
        },
        (error: HttpErrorResponse) => {
          Swal.fire({
            title: 'Error!',
            text: 'Error de servidor. Por favor, intenta nuevamente más tarde.',
            icon: 'error',
          });
        }
      );
  }

  SingUp() {
    this.router.navigateByUrl('/register');
  }
}

export interface Login {
  correo: string;
  contrasena: string;
}
