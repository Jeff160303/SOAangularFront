import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginObj: Login;
  authService: any;

  constructor(private http: HttpClient, private router: Router) {
    this.loginObj = new Login();
  }

  onLogin() {
    debugger;
    this.http
      .post<{
        message: string;
        result: boolean;
        data: { token: string; rol: string } | null;
      }>('http://localhost:8080/usuarios/iniciarSesion', this.loginObj)
      .subscribe(
        (res: any) => {
          if (res.result) {
            Swal.fire({
              title: "Bienvenido!",
              text: "Acceso correcto!",
              icon: "success"
            });
            localStorage.setItem('angular17token', res.data.token);
            this.router.navigateByUrl('/dashboard');
          } else {
            alert(res.message);
          }
        },
        (error: HttpErrorResponse) => {
          if (error.status === 401 && error.error.message) {
            Swal.fire({
              title: "error!",
              text: "Credenciales incorrectas!",
              icon: "error"
            });
          } else {
            alert('Error: ' + error.message);
          }
        }
      );
  }
}

export class Login {
  correo: string;
  contrasena: string;
  constructor() {
    this.correo = '';
    this.contrasena = '';
  }
}
