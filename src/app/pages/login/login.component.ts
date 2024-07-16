import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService, UserData } from '../../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  correo: string = '';
  dni: string = '';
  newPassword: string = '';

  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private authService: AuthService) {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.http.post<UserData>('http://localhost:8090/usuarios/iniciarSesion', this.loginForm.value)
        .subscribe(
          (userData: UserData) => {
            if (userData.rol !== 'error') {
              this.authService.setUser(userData);
              Swal.fire({
                title: 'Bienvenido!',
                text: 'Acceso correcto!',
                icon: 'success',
              });
              if (this.authService.getUserRole() == 'administrador'){
                this.router.navigateByUrl('/editarproductos');
              }else if (this.authService.getUserRole() == 'delivery'){
                this.router.navigateByUrl('/deliveryGestion');
              }else{
                this.router.navigateByUrl('/');
              }
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
  }

  SingUp() {
    this.router.navigateByUrl('/register');
  }


  olvidoContrasena() {
    Swal.fire({
      title: 'Olvidaste tu contraseña?',
      html:
        '<input id="correo" class="swal2-input" placeholder="Correo electrónico">' +
        '<input id="dni" class="swal2-input" placeholder="DNI">' +
        '<input id="nuevaContrasena" type="password" class="swal2-input" placeholder="Nueva contraseña">',
      focusConfirm: false,
      preConfirm: () => {
        const correo = (document.getElementById('correo') as HTMLInputElement).value;
        const dni = (document.getElementById('dni') as HTMLInputElement).value;
        const nuevaContrasena = (document.getElementById('nuevaContrasena') as HTMLInputElement).value;
        if (!correo || !dni || !nuevaContrasena) {
          Swal.showValidationMessage('Por favor, introduce un correo electrónico, DNI y nueva contraseña válidos');
        }
        return { correo, dni, nuevaContrasena };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const { correo, dni, nuevaContrasena } = result.value;
        const url = `http://localhost:8090/usuarios/olvidoContraseña/${encodeURIComponent(correo)}/${dni}`;
        this.http.put<string>(url, { newPassword: nuevaContrasena }).subscribe(
          (response: any) => {
            if (response == "1") {
              Swal.fire({
                title: 'Contraseña actualizada!',
                text: 'Tu contraseña ha sido actualizada correctamente.',
                icon: 'success',
              });
            } else {
              Swal.fire({
                title: 'Error!',
                text: 'No se pudo procesar la solicitud. Verifica los datos proporcionados.',
                icon: 'error',
              });
            }
          },
          (error: HttpErrorResponse) => {
            Swal.fire({
              title: 'Error!',
              text: 'No se pudo procesar la solicitud. Verifica los datos proporcionados.',
              icon: 'error',
            });
          }
        );
      }
    });
  }
  
  
  
  
  
  


}
